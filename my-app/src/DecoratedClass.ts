function sealed(constructor: Function) {
  console.log('sealed:', constructor)
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
export class DecoratedClass {
  hello() {
    console.log('hello')
  }
}
