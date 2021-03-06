import { createToken, Lexer, IToken, Parser } from 'chevrotain'
import * as ast from './ast'

const Open = createToken({ name: 'Open', pattern: /\(/, label: '(' })
const Close = createToken({ name: 'Close', pattern: /\)/, label: ')' })
const PropValue = createToken({
    name: 'PropValue',
    pattern: /("[^"]*"|[^\s\(\)]+)/,
})
const WhiteSpace = createToken({
    name: 'WhiteSpace',
    pattern: /\s+/,
    group: Lexer.SKIPPED
})

// Export
const Export = createToken({ name: 'Export', pattern: /export/, label: 'export' })
const Version = createToken({ name: 'Version', pattern: /version/, label: 'version' })
const Components = createToken({
    name: 'Components',
    pattern: /components/,
    label: 'components',
})
const Nets = createToken({
    name: 'Nets',
    pattern: /nets/,
    label: 'nets',
})

// Design
const Design = createToken({ name: 'Design', pattern: /design/, label: 'design' })
const Source = createToken({ name: 'Source', pattern: /source/, label: 'source' })
const Date = createToken({ name: 'Date', pattern: /date/, label: 'date' })
const Tool = createToken({ name: 'Tool', pattern: /tool/, label: 'tool' })

// Component
const Comp = createToken({
    name: 'Comp',
    pattern: /comp/,
    label: 'comp',
    longer_alt: Components,
})
const Ref = createToken({
    name: 'Ref',
    pattern: /ref/,
    label: 'ref',
})
const Value = createToken({
    name: 'Value',
    pattern: /value/,
    label: 'value',
})
const Footprint = createToken({
    name: 'Footprint',
    pattern: /footprint/,
    label: 'footprint',
})
const Libsource = createToken({
    name: 'Libsource',
    pattern: /libsource/,
    label: 'libsource',
})
const Lib = createToken({
    name: 'Lib',
    pattern: /lib/,
    label: 'lib',
})
const Part = createToken({
    name: 'Part',
    pattern: /part/,
    label: 'part',
})
const Sheetpath = createToken({
    name: 'Sheetpath',
    pattern: /sheetpath/,
    label: 'sheetpath',
})
const Names = createToken({
    name: 'Names',
    pattern: /names/,
    label: 'names',
})
const Tstamps = createToken({
    name: 'Tstamps',
    pattern: /tstamps/,
    label: 'tstamps',
})
const Tstamp = createToken({
    name: 'Tstamp',
    pattern: /tstamp/,
    label: 'tstamp',
})

// Net
const Net = createToken({
    name: 'Net',
    pattern: /net/,
    label: 'net',
    longer_alt: Nets,
})
const Code = createToken({
    name: 'Code',
    pattern: /code/,
    label: 'code',
})
const Name = createToken({
    name: 'Name',
    pattern: /name/,
    label: 'name',
})

// Node
const Node = createToken({
    name: 'Node',
    pattern: /node/,
    label: 'node',
})
const Pin = createToken({
    name: 'Pin',
    pattern: /pin/,
    label: 'pin',
})

const allTokens = [
    Open, Close,
    Export, Version, Components, Nets,
    Design, Source, Date, Tool,
    Comp, Ref, Value, Footprint,
    Libsource, Lib, Part,
    Sheetpath, Names, Tstamps, Tstamp,
    Net, Code, Name,
    Node, Pin,
    PropValue, WhiteSpace,
]

export const lexerInstance = new Lexer(allTokens)

export class NetlistParser extends Parser {
    constructor(input: IToken[]) {
        super(input, allTokens, { outputCst: true })
        this.performSelfAnalysis()
    }

    public top = this.RULE('top', () => {
        this.CONSUME(Open)
        this.CONSUME(Export)
        this.SUBRULE(this.version)
        this.SUBRULE(this.design)
        this.SUBRULE(this.components)
        this.SUBRULE(this.nets)
        this.CONSUME(Close)
    })

    public version = this.RULE('version', () => {
        this.CONSUME(Open)
        this.CONSUME(Version)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public design = this.RULE('design', () => {
        this.CONSUME(Open)
        this.CONSUME(Design)
        this.SUBRULE(this.source)
        this.SUBRULE(this.date)
        this.SUBRULE(this.tool)
        this.CONSUME(Close)
    })

    public source = this.RULE('source', () => {
        this.CONSUME(Open)
        this.CONSUME(Source)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public date = this.RULE('date', () => {
        this.CONSUME(Open)
        this.CONSUME(Date)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public tool = this.RULE('tool', () => {
        this.CONSUME(Open)
        this.CONSUME(Tool)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public components = this.RULE('components', () => {
        this.CONSUME(Open)
        this.CONSUME(Components)
        this.MANY(() => this.SUBRULE(this.comp))
        this.CONSUME(Close)
    })

    public nets = this.RULE('nets', () => {
        this.CONSUME(Open)
        this.CONSUME(Nets)
        this.MANY(() => this.SUBRULE(this.net))
        this.CONSUME(Close)
    })

    public comp = this.RULE('comp', () => {
        this.CONSUME(Open)
        this.CONSUME(Comp)
        this.SUBRULE(this.ref)
        this.SUBRULE(this.value)
        this.SUBRULE(this.footprint)
        this.OPTION1(() => this.SUBRULE(this.libsource))
        this.OPTION2(() => this.SUBRULE(this.sheetpath))
        this.OPTION3(() => this.SUBRULE(this.tstamp))
        this.CONSUME(Close)
    })

    public ref = this.RULE('ref', () => {
        this.CONSUME(Open)
        this.CONSUME(Ref)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public value = this.RULE('value', () => {
        this.CONSUME(Open)
        this.CONSUME(Value)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public footprint = this.RULE('footprint', () => {
        this.CONSUME(Open)
        this.CONSUME(Footprint)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public libsource = this.RULE('libsource', () => {
        this.CONSUME(Open)
        this.CONSUME(Libsource)
        this.SUBRULE(this.lib)
        this.SUBRULE(this.part)
        this.CONSUME(Close)
    })

    public lib = this.RULE('lib', () => {
        this.CONSUME(Open)
        this.CONSUME(Lib)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public part = this.RULE('part', () => {
        this.CONSUME(Open)
        this.CONSUME(Part)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public sheetpath = this.RULE('sheetpath', () => {
        this.CONSUME(Open)
        this.CONSUME(Sheetpath)
        this.SUBRULE(this.names)
        this.SUBRULE(this.tstamps)
        this.CONSUME(Close)
    })

    public names = this.RULE('names', () => {
        this.CONSUME(Open)
        this.CONSUME(Names)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public tstamps = this.RULE('tstamps', () => {
        this.CONSUME(Open)
        this.CONSUME(Tstamps)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public tstamp = this.RULE('tstamp', () => {
        this.CONSUME(Open)
        this.CONSUME(Tstamp)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public net = this.RULE('net', () => {
        this.CONSUME(Open)
        this.CONSUME(Net)
        this.SUBRULE(this.code)
        this.SUBRULE(this.name)
        this.MANY(() => this.SUBRULE(this.node))
        this.CONSUME(Close)
    })

    public code = this.RULE('code', () => {
        this.CONSUME(Open)
        this.CONSUME(Code)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public name = this.RULE('name', () => {
        this.CONSUME(Open)
        this.CONSUME(Name)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public node = this.RULE('node', () => {
        this.CONSUME(Open)
        this.CONSUME(Node)
        this.SUBRULE(this.ref)
        this.SUBRULE(this.pin)
        this.CONSUME(Close)
    })

    public pin = this.RULE('pin', () => {
        this.CONSUME(Open)
        this.CONSUME(Pin)
        this.SUBRULE(this.propValue)
        this.CONSUME(Close)
    })

    public propValue = this.RULE('propValue', () => {
        this.CONSUME(PropValue)
    })
}

export const parserInstance = new NetlistParser([])

const BaseNetlistVisitor = parserInstance.getBaseCstVisitorConstructor()

export class NetlistVisitor extends BaseNetlistVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    public top(ctx: any) {
        const design: ast.Design = this.visit(ctx.design)
        design.version = this.visit(ctx.version)
        if (ctx.components) {
            this.visit(ctx.components).forEach((comp: ast.Component) => {
                design.addComponent(comp)
            })
        }
        if (ctx.nets) {
            this.visit(ctx.nets).forEach((net: ast.Net) => {
                design.addNet(net)
            })
        }
        return design
    }

    public version(ctx: any): string {
        return this.visit(ctx.propValue)
    }

    public design(ctx: any): ast.Design {
        return new ast.Design({
            source: this.visit(ctx.source),
            date: this.visit(ctx.date),
            tool: this.visit(ctx.tool),
        })
    }

    public source(ctx: any): string {
        return this.visit(ctx.propValue)
    }

    public date(ctx: any): string {
        return this.visit(ctx.propValue)
    }

    public tool(ctx: any): string {
        return this.visit(ctx.propValue)
    }

    public components(ctx: any): ast.Component[] {
        return ctx.comp.map((ctx: any) => this.visit(ctx))
    }

    public nets(ctx: any): ast.Net[] {
        return ctx.net.map((ctx: any) => this.visit(ctx))
    }

    public comp(ctx: any): ast.Component {
        return new ast.Component({
            ref: this.visit(ctx.ref),
            value: this.visit(ctx.value),
            footprint: this.visit(ctx.footprint),
        })
    }

    public ref(ctx: any): string {
        return this.visit(ctx.propValue)
    }

    public value(ctx: any): string {
        return this.visit(ctx.propValue)
    }

    public footprint(ctx: any): string {
        return this.visit(ctx.propValue)
    }

    public libsource(ctx: any): void {}

    public lib(ctx: any): void {}

    public part(ctx: any): void {}

    public sheetpath(ctx: any): void {}

    public names(ctx: any): void {}

    public tstamps(ctx: any): void {}

    public tstamp(ctx: any): void {}

    public net(ctx: any): ast.Net {
        const net = new ast.Net({
            code: this.visit(ctx.code),
            name: this.visit(ctx.name),
        })
        ctx.node.forEach((ctx: any) => {
            net.addNode(this.visit(ctx))
        })
        return net
    }

    public code(ctx: any): number {
        return parseInt(this.visit(ctx.propValue))
    }

    public name(ctx: any): string {
        return this.visit(ctx.propValue)
    }

    public node(ctx: any): ast.Node {
        return new ast.Node({
            ref: this.visit(ctx.ref),
            pin: this.visit(ctx.pin),
        })
    }

    public pin(ctx: any): string {
        return this.visit(ctx.propValue)
    }

    public propValue(ctx: any): string {
        const value = ctx.PropValue[0].image
        if (value.startsWith('"')) {
            return value.substring(1, value.length - 1)
        }
        return value
    }
}

export const visitorInstance = new NetlistVisitor()

export function tokenize(text: string): IToken[] {
    const lexResult = lexerInstance.tokenize(text)
    if (lexResult.errors.length > 0) {
        throw new Error(lexResult.errors[0].message);
    }
    return lexResult.tokens
}

export function parse(text: string): ast.Design {
    const tokens = tokenize(text)
    parserInstance.input = tokens
    const cst = parserInstance.top()
    if (parserInstance.errors.length > 0) {
        const error = parserInstance.errors[0]
        throw new Error(`msg: ${error.message} ln: ${error.token.startLine} ` +
                        `col: ${error.token.startColumn}`)
    }
    return visitorInstance.visit(cst) as ast.Design
}
