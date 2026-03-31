import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem("user").title("Users"),
      S.documentTypeListItem("car").title("Car"),
      S.documentTypeListItem("inspection").title("Inspection"),
      S.documentTypeListItem("serviceRecord").title("Service Record"),
      S.documentTypeListItem("serviceType").title("Service Type"),
    ])
