import { customerEmailTemplate } from "./templates/customerEmailTemplate.mjs"
import { internalEmailTemplate } from "./templates/internalEmailTemplate.mjs"

export const emailTemplatesLookup = {
    1: customerEmailTemplate,
    2: internalEmailTemplate
}