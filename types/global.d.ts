export { };

declare global{
  type Maybe<T> = Course | null | undefined
}

interface Window {
  $: any;
  jQuery: any;
}