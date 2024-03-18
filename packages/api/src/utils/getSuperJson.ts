import SuperJSON from 'superjson';

// SuperJSON.registerCustom<null, string>(
//   {
//     isApplicable: (v): v is null => {
//       console.log({ v });

//       return v === null;
//     },
//     serialize: (v) => 'null',
//     deserialize: (v) => null,
//   },
//   'null'
// );

export const getSuperJson = () => SuperJSON;
