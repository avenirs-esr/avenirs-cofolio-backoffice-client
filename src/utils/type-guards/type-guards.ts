export function hasStringField<T extends string> (
  obj: unknown,
  field: T
): obj is Record<T, string> {
  return (
    typeof obj === 'object'
    && obj !== null
    && Object.prototype.hasOwnProperty.call(obj, field)
    && typeof (obj as Record<T, unknown>)[field] === 'string'
  )
}

export function isEnumMember<T extends Record<string, string>> (enumObject: T, value: string): value is T[keyof T] {
  return Object.values(enumObject).includes(value)
}
