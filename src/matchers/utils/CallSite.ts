export class CallSite implements NodeJS.CallSite {
  constructor(
    private opts: {
      thisVal?: unknown;
      typeName?: string | null;
      fn?: Function;
      fnName?: string | null;
      methodName?: string | null;
      file?: string;
      line?: number | null;
      col?: number | null;
      evalOrigin?: string;
      flags?: Partial<{
        toplevel: boolean;
        eval: boolean;
        native: boolean;
        ctor: boolean;
        async: boolean;
        promiseAll: boolean;
        promiseIndex: number;
      }>;
    }
  ) {}

  /* trivial one-liners */
  getThis() {
    return this.opts.thisVal;
  }
  getTypeName() {
    return this.opts.typeName ?? null;
  }
  getFunction() {
    return this.opts.fn;
  }
  getFunctionName() {
    return this.opts.fnName ?? null;
  }
  getMethodName() {
    return this.opts.methodName ?? null;
  }
  getFileName() {
    return this.opts.file;
  }
  getLineNumber() {
    return this.opts.line ?? 0;
  }
  getColumnNumber() {
    return this.opts.col ?? 0;
  }
  getEvalOrigin() {
    return this.opts.evalOrigin;
  }
  isToplevel() {
    return !!this.opts.flags?.toplevel;
  }
  isEval() {
    return !!this.opts.flags?.eval;
  }
  isNative() {
    return !!this.opts.flags?.native;
  }
  isConstructor() {
    return !!this.opts.flags?.ctor;
  }
  isAsync() {
    return !!this.opts.flags?.async;
  }
  isPromiseAll() {
    return !!this.opts.flags?.promiseAll;
  }
  getPromiseIndex() {
    return this.opts.flags?.promiseIndex ?? null;
  }

  getScriptNameOrSourceURL() {
    return this.opts.file ?? "";
  }

  getScriptHash() {
    return "";
  }

  getEnclosingColumnNumber() {
    return 0;
  }

  getEnclosingLineNumber() {
    return 0;
  }

  getPosition() {
    return 0;
  }

  toString() {
    if (this.isNative()) return `    at [native]`;
    if (!this.getFileName()) return `    at <anonymous>`;
    return `${this.getFileName()}:${this.getLineNumber()}:${this.getColumnNumber()}`;
  }
}
