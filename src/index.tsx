import * as React from 'react'

// This is fine
export const Foo = (props: any) => (
  <div>Hello world</div>
)

// This indents the JSX incorrectly
export const Bar = ({
  foo,
  bar,
}: any) => (
    <div>Hello world</div> // Try: Dedent then save
  )

// Same happens for non-JSX returns
export const test = ({
  foo,
  bar
}: any) => (
    (foo + bar) - (foo * bar) / (foo - bar)
  )
