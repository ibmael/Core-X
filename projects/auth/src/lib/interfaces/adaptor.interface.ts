export interface Adaptor<TInput, TOutput> {
  adapt(data: TInput): TOutput;
}
