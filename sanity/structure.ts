import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("user").title("Users"),
      S.documentTypeListItem("car").title("Car"),
      S.documentTypeListItem("todo").title("Todo"),
      S.documentTypeListItem("inspection").title("Inspection"),
      S.documentTypeListItem("serviceRecord").title("Service Record"),
      S.documentTypeListItem("serviceType").title("Service Type"),
    ]);
