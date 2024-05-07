import { Component } from "vue";
import { getSchema, getSchemas } from "./Schema";

export default function SchemaComponent(value: string, component: Component) {
    return function (target: any, attr: any) {
        target.schema[attr].components[value] = component
    }
}


export function getSchemaComponent(target: any, prop: string, elName: string, ...args:any[]): Component {
    const schema = getSchema(target, prop)
    const component = schema.components[elName]
    return component(args)
}


export function getSchemaComponents(target: any, elName: string): { name: string, component: (...args: any[]) => Component }[] {
    const schema = getSchemas(target)
    return schema.map(s => ({ name: s.name, component: s.components[elName] }))
}

