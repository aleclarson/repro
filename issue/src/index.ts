const foo = Symbol('foo') 
 
export class Test { 
  private [foo]() { 
    return true 
  } 
}
