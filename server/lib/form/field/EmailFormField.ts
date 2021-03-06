import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";
import {ValidationUtil} from "~/server/lib/util/ValidationUtil";
import {IMaxLengthFormField} from "~/server/lib/form/field/IMaxLengthFormField";
import {IClientFormField} from "~/server/lib/form/field/IClientFormField";

interface IClientEmailFormField extends IClientFormField<string> {
    
    maxLength: number;
    validation: string[] // representation of the regex, where the first element will be the regex-source, while the second element will be the regex-modifiers
    
}

export class EmailFormField extends AbstractFormField<string, string> implements IMaxLengthFormField {
    
    constructor(id : string, emailAddress : string) {
        super(id, emailAddress);
    }
    
    validate() {
        if(!super.validate()) {
            return false;
        }
        
        if(this.isRequired() && this.getSafeValue().length === 0) {
            return this.setValidationError("ERR_FORM_VALIDATION_VALUE_UNDEFINED");
        }
    
        if(!this.validateMaxLength()) {
            return this.setValidationError("ERR_FORM_VALIDATION_EMAIL_TOO_LONG");
        }
        
        if(!ValidationUtil.isEmailAddress(this.getSafeValue())) {
            return this.setValidationError("ERR_FORM_VALIDATION_EMAIL_INVALID");
        }
        
        return true;
    }
    
    //<editor-fold desc="Implementation of IMaxLengthFormField">
    maxLength: number = null;
    
    getMaxLength() {
        return this.maxLength;
    }
    
    setMaxLength(length: number) {
        this.maxLength = length;
        
        return this;
    }
    
    validateMaxLength() {
        return this.maxLength === null || this.getSafeValue().length <= this.getMaxLength();
    }
    //</editor-fold>
    
    // TODO: rewrite html special chars
    getSafeValue(): string {
        return this.getValue().trim();
    }
    
    getClientField(): IClientEmailFormField {
        let validationParts = /\/(.*)\/(.*)/.exec(ValidationUtil.getEmailValidator().toString());
        
        return {
            id: this.getId(),
            type: "email",
            label: this.getLabel(),
            value: this.getSafeValue(),
            error: this.getValidationError(),
            required: this.isRequired(),
            maxLength: this.getMaxLength(),
            validation: [validationParts[1], validationParts[2]]
        };
    }
    
}