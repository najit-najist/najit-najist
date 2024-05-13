export const sendPlausibleEvent = (
  eventName: string,
  payload: { props?: object; revenue?: object }
) =>
  fetch('https://plausible.io/api/event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain: 'najitnajist.cz',
      name: eventName,
      referrer: 'https://najitnajist.cz/muj-ucet/kosik/pokladna',
      url: 'https://najitnajist.cz/muj-ucet/kosik/pokladna',
      ...payload,
    }),
  });
