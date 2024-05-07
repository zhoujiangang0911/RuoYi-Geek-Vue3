type Schema = { name: string, elType: string }
export function getSchema(target: any, prop: string): Schema {
    const constructor = typeof target === 'function' ? target : target.constructor
    const schemaObj = constructor.prototype.schema
    if (!!schemaObj) {
        const schema = schemaObj[prop]
        if (!!schema) return schema
        else throw new Error(`${constructor.name}'s ${prop} have not @schema`)
    } else {
        throw new Error(`${constructor.name} have not @schema`)
    }
}

export function getSchemaName(target: any, prop: string): string {
    return getSchema(target, prop).name
}

export function getSchemaElType(target: any, prop: string): string {
    return getSchema(target, prop).elType
}

export default function Schema(name: string, elType?: string) {
    return function (target: any, attr: any) {
        if (target.schema == undefined) target.schema = {}
        target.schema[attr] = { name, elType };
    }
}
