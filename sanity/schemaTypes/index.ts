import { type SchemaTypeDefinition } from 'sanity'
import user from "./user";
import car from "./car";
import serviceType from "./serviceType";
import serviceRecord from "./serviceRecord";
import inspection from "./inspection";


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, car, serviceType, serviceRecord, inspection],
}
