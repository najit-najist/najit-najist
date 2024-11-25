'use client';

import { Alert } from '@components/common/Alert';
import { Badge } from '@components/common/Badge';
import { Button } from '@components/common/Button';
import { Modal } from '@components/common/Modal';
import { Paper } from '@components/common/Paper';
import { Tooltip } from '@components/common/Tooltip';
import { Input, inputPrefixSuffixStyles } from '@components/common/form/Input';
import { Textarea } from '@components/common/form/Textarea';
import { createProductRawMaterialAction } from '@components/page-components/ProductRawMaterialManageContent/actions/createProductRawMaterialAction';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import {
  ArrowPathIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { ProductRawMaterial } from '@najit-najist/database/models';
import { useMutation } from '@tanstack/react-query';
import { trpc } from '@trpc/web';
import { handlePromiseForToast } from '@utils/handleActionForToast';
import { clsx } from 'clsx';
import {
  ChangeEventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormState,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounceValue } from 'usehooks-ts';

import { ProductFormData } from '../_types';

const fieldName = 'composedOf';

type AppendMaterialFormValues = {
  id: string | number | undefined;
  description?: string | null;
  notes?: string | null;
  rawMaterial: Pick<ProductRawMaterial, 'id' | 'name'>;
  order?: number;
  editingAtIndex?: number;
};

const useAddRawMaterial = () =>
  useMutation({
    mutationFn: createProductRawMaterialAction,
    mutationKey: ['create-product-raw-material'],
  });

export function ProductCompositionsEdit(): ReactNode {
  const { isSubmitting } = useFormState();
  const appendMaterialForm = useForm<AppendMaterialFormValues>();
  const [rawMaterialModalOpen, setRawMaterialModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounceValue('', 500);
  const trpcUtils = trpc.useUtils();

  const editingAtIndex = useWatch({
    name: 'editingAtIndex',
    control: appendMaterialForm.control,
  });
  const isEditing = typeof editingAtIndex === 'number';

  const { isPending: isCreatingRawMaterial, mutateAsync: createRawMaterial } =
    useAddRawMaterial();
  const { remove, fields, append, update } = useFieldArray<
    ProductFormData,
    typeof fieldName
  >({
    name: fieldName,
  });
  const { data, isPending: isLoading } =
    trpc.products.rawMaterials.get.many.useQuery(
      { perPage: 4, search: debouncedSearch },
      { enabled: search.length ? !!debouncedSearch.length : false },
    );

  const setSearchValue = useCallback(
    (value: string = '') => {
      setDebouncedSearch(value);
      setSearch(value);
    },
    [setSearch, setDebouncedSearch],
  );
  const handleOnChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const value = event.target.value;
      setSearchValue(value);
    },
    [setSearchValue],
  );
  const handleItemRemove = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      const index = Number(event.currentTarget.dataset.index);
      remove(index);
    },
    [remove],
  );
  const handleItemEdit: MouseEventHandler<HTMLButtonElement> = (event) => {
    const index = Number(event.currentTarget.dataset.index);
    const valuesAtIndex = fields[index];

    if (!valuesAtIndex) {
      throw new Error(`There are no values at index ${index}`);
    }

    appendMaterialForm.reset(
      // @ts-ignore
      {
        editingAtIndex: index,
        ...valuesAtIndex,
      },
    );

    setRawMaterialModalOpen(true);
  };

  const onCreateRawMaterial: MouseEventHandler<HTMLAnchorElement> = async (
    event,
  ) => {
    event.preventDefault();
    const value = String(event.currentTarget.dataset.value);

    const newMaterialAsPromise = createRawMaterial({ name: value });

    toast.promise(handlePromiseForToast(newMaterialAsPromise), {
      error: (error) => `Nemůžeme vytvořit surovinu: ${error.message}`,
      loading: 'Vytvářím surovinu',
      success: 'Surovina vytvořena! Pokračujte v přidání pod produkt...',
    });

    setRawMaterialModalOpen(true);

    const material = await newMaterialAsPromise;
    if ('errors' in material) {
      toast.error(
        `Nemůžeme vytvořit novou surovinu, protože: ${material.errors.name}`,
      );

      return;
    }

    appendMaterialForm.setValue('rawMaterial', material.data);
    trpcUtils.products.rawMaterials.get.many.invalidate();
  };

  const onAppendOrEditRawMaterial: SubmitHandler<AppendMaterialFormValues> = ({
    editingAtIndex,
    id,
    ...values
  }) => {
    const payload = {
      ...values,
      order: values.order ?? (fields.at(-1)?.order ?? -1) + 1,
    };

    if (typeof editingAtIndex === 'number') {
      update(editingAtIndex, payload);
    } else {
      append(payload);
    }

    setRawMaterialModalOpen(false);
    setTimeout(() => {
      appendMaterialForm.reset();
    }, 100);
  };

  return (
    <>
      <div className="relative">
        <Combobox
          immediate
          multiple
          by="id"
          value={fields.map(({ rawMaterial }) => rawMaterial)}
          onChange={(values) => {
            const lastItem = values.at(-1);

            if (!lastItem) {
              return;
            }

            appendMaterialForm.setValue('rawMaterial', {
              ...lastItem,
              name: lastItem.name ?? '',
            });
            setRawMaterialModalOpen(true);
          }}
          onClose={setSearchValue}
          disabled={isSubmitting}
        >
          <ComboboxInput
            as={Input}
            placeholder="Vyhledávání surovin..."
            size="normal"
            suffix={
              <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
                {isLoading && search.length ? (
                  <ArrowPathIcon className="w-6 h-6 mx-5 my-2 animate-spin" />
                ) : (
                  <MagnifyingGlassIcon className="w-6 h-6 mx-5 my-2" />
                )}
              </div>
            }
            onChange={handleOnChange}
            disabled={isSubmitting}
          />
          <ComboboxOptions
            as={Paper}
            anchor={{ to: 'bottom start', gap: 4 }}
            className="empty:hidden w-[--input-width] p-1"
          >
            {!!search ? (
              data?.items.length ? (
                data?.items.map((category) => (
                  <ComboboxOption
                    key={category.id}
                    value={category}
                    className="data-[focus]:bg-project-primary/20 p-1 rounded hover:cursor-pointer flex justify-between items-start"
                  >
                    {({ selected }) => (
                      <>
                        {category.name}
                        {selected ? (
                          <CheckIcon className="w-6 h-6 flex-none ml-2" />
                        ) : null}
                      </>
                    )}
                  </ComboboxOption>
                ))
              ) : !isLoading ? (
                <p className="p-3">
                  Žádné výsledky.{' '}
                  <a
                    href="#"
                    tabIndex={1}
                    data-value={debouncedSearch}
                    onClick={onCreateRawMaterial}
                    role="button"
                    className="text-project-primary hover:underline"
                  >
                    Vytvořit &quot;{debouncedSearch}&quot; a přidat?
                  </a>
                </p>
              ) : null
            ) : null}
          </ComboboxOptions>
        </Combobox>
      </div>
      {fields.length ? null : (
        <p className="text-gray-500 mt-5">
          Zatím žádné suroviny. Žačněte přidávat vyhledáváním
        </p>
      )}
      <div className="mb-3 flex mt-3 gap-2 flex-wrap duration">
        {fields.map((item, index) => (
          <Badge key={item.id} color="green" size="lg">
            <Tooltip
              disabled={!item.description}
              trigger={
                <span
                  className={clsx(
                    item.description
                      ? 'decoration-dashed underline hover:decoration-solid cursor-help'
                      : undefined,
                  )}
                >
                  {item.rawMaterial.name}
                  {item.notes ? <> ({item.notes})</> : null}
                </span>
              }
            >
              {item.description}
            </Tooltip>

            <button
              onClick={handleItemEdit}
              data-index={index}
              className="text-blue-800 hover:bg-blue-100 duration-300 p-1 -mr-1 rounded-md"
              type="button"
            >
              <PencilIcon className="w-4 h-4 hover:rotate-12 duration-300" />
            </button>
            <button
              onClick={handleItemRemove}
              data-index={index}
              className="text-red-800 hover:bg-red-200 duration-300 p-1 -mr-1 rounded-md"
              type="button"
            >
              <XMarkIcon className="w-5 h-5 hover:rotate-90 duration-300" />
            </button>
          </Badge>
        ))}
      </div>
      <FormProvider {...appendMaterialForm}>
        <Modal
          open={rawMaterialModalOpen}
          onClose={() => {
            if (confirm('Opravdu zavřít bez uložení?')) {
              setRawMaterialModalOpen(false);
            }
          }}
        >
          <h2>
            {isEditing
              ? 'Uložení suroviny pod produktem'
              : 'Vložení suroviny pod produkt'}
          </h2>
          <form
            onSubmit={(event) => {
              event.stopPropagation();
              appendMaterialForm.handleSubmit(onAppendOrEditRawMaterial)(event);
            }}
          >
            {isCreatingRawMaterial ? (
              <Alert
                heading="Stále se vytváří surovina, sečkejte chvíli prosím..."
                className="my-4"
              />
            ) : null}
            <Input
              required
              rootClassName="mt-4"
              label="Název suroviny"
              {...appendMaterialForm.register('rawMaterial.name')}
              disabled
            />
            <Input
              rootClassName="mt-4"
              label="Poznámky"
              placeholder="Velikost v procentech, jiny název, atp..."
              disabled={isCreatingRawMaterial}
              {...appendMaterialForm.register('notes')}
            />
            <Textarea
              wrapperClassName="mt-4"
              label="Popisek"
              placeholder="Vysvětlivka, varování, atp..."
              disabled={isCreatingRawMaterial}
              {...appendMaterialForm.register('description')}
            />

            <Button
              autoFocus
              type="submit"
              className="mt-4"
              isLoading={isCreatingRawMaterial}
            >
              {isEditing ? 'Uložit' : 'Vložit'}
            </Button>
          </form>
        </Modal>
      </FormProvider>
    </>
  );
}
