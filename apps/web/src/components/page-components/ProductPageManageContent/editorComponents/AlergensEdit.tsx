'use client';

import { trpc } from '@client/trpc';
import {
  ArrowPathIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { ProductRawMaterial } from '@najit-najist/database/models';
import {
  Alert,
  Badge,
  Button,
  Input,
  inputPrefixSuffixStyles,
  Modal,
  Paper,
  Textarea,
  toast,
  Tooltip,
} from '@najit-najist/ui';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@najit-najist/ui/headless';
import { useMutation } from '@tanstack/react-query';
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
  useController,
  useFieldArray,
  useForm,
  useFormState,
} from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';

import { ProductFormData } from '../_types';
import { createProductAlergen } from '../actions/createProductAlergen';

const fieldName = 'alergens';

const useAddAlergen = () =>
  useMutation({
    mutationFn: createProductAlergen,
    mutationKey: ['create-product-alergen'],
  });

type AppendMaterialFormValues = {
  id: number | null | undefined;
  name: string | null | undefined;
  description: string | null | undefined;
};

export function AlergensEdit(): ReactNode {
  const { isSubmitting } = useFormState();
  const createAlergenForm = useForm<AppendMaterialFormValues>();
  const [createNewOpen, setCreateNewOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounceValue('', 500);
  const trpcUtils = trpc.useUtils();
  const { remove } = useFieldArray<ProductFormData, typeof fieldName>({
    name: fieldName,
  });
  const { field } = useController<ProductFormData, typeof fieldName>({
    name: fieldName,
  });

  const { isPending: isCreatingAlergen, mutateAsync: createAlergen } =
    useAddAlergen();
  const { data, isPending: isLoading } =
    trpc.products.alergens.get.many.useQuery(
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
  const handleItemRemove: MouseEventHandler<HTMLButtonElement> = (event) => {
    const index = Number(event.currentTarget.dataset.index);
    remove(index);
  };

  const onClickCreateNew: MouseEventHandler<HTMLAnchorElement> = async (
    event,
  ) => {
    event.preventDefault();
    const value = String(event.currentTarget.dataset.value);

    setCreateNewOpen(true);

    createAlergenForm.setValue('name', value);
  };

  const onSubmitCreateAlergen: SubmitHandler<
    AppendMaterialFormValues
  > = async ({ id, ...values }) => {
    const result = await createAlergen(
      // @ts-ignore
      values,
    );

    if ('errors' in result) {
      for (const [key, value] of Object.entries(result.errors)) {
        // @ts-ignore
        createAlergenForm.setError(key, value);
      }

      throw new Error('Failed to create alergen');
    }

    field.onChange([...field.value, result.data]);

    setCreateNewOpen(false);
    trpcUtils.products.alergens.get.many.invalidate();
    setTimeout(() => {
      createAlergenForm.reset();
    }, 100);
  };

  const value = field.value ?? [];

  return (
    <>
      <div className="relative">
        <Combobox
          immediate
          multiple
          by="id"
          value={value}
          onChange={field.onChange}
          onClose={setSearchValue}
          disabled={isSubmitting}
        >
          <ComboboxInput
            as={Input}
            placeholder="Vyhledávání alergenů..."
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
                    onClick={onClickCreateNew}
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
      {value.length ? null : (
        <p className="text-gray-500 mt-5">
          Zatím žádné alergeny. Žačněte přidávat vyhledáváním
        </p>
      )}
      <div className="mb-3 flex mt-3 gap-2 flex-wrap duration">
        {value.map((item, index) => (
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
                  {item.name}
                </span>
              }
            >
              {item.description}
            </Tooltip>

            {/*  <button
                 onClick={handleItemEdit}
                 data-index={index}
                 className="text-blue-800 hover:bg-blue-100 duration-300 p-1 -mr-1 rounded-md"
                 type="button"
               >
                 <PencilIcon className="w-4 h-4 hover:rotate-12 duration-300" />
               </button> */}
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
      <FormProvider {...createAlergenForm}>
        <Modal
          open={createNewOpen}
          onClose={() => {
            if (confirm('Opravdu zavřít bez uložení?')) {
              setCreateNewOpen(false);
            }
          }}
        >
          <h2>Vytvoření nového alergenu</h2>
          <form
            onSubmit={(event) => {
              event.stopPropagation();
              createAlergenForm.handleSubmit(onSubmitCreateAlergen)(event);
            }}
          >
            <Input
              required
              rootClassName="mt-4"
              label="Název alergenu"
              {...createAlergenForm.register('name')}
              error={createAlergenForm.formState.errors.name}
              disabled={isCreatingAlergen}
            />
            <Textarea
              wrapperClassName="mt-4"
              label="Popisek"
              placeholder="Vysvětlivka, varování, atp..."
              disabled={isCreatingAlergen}
              error={createAlergenForm.formState.errors.description}
              {...createAlergenForm.register('description')}
            />

            <Button
              autoFocus
              type="submit"
              className="mt-4"
              isLoading={isCreatingAlergen}
            >
              Vytvořit
            </Button>
          </form>
        </Modal>
      </FormProvider>
    </>
  );
}
