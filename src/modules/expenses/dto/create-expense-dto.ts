import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength } from "class-validator";
import { EXPENSES_NAME_MAX_LENGTH } from "./expenses-field.constants";

export class CreateExpenseDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(EXPENSES_NAME_MAX_LENGTH)
    readonly name!: string;

    @IsNumber()
    @IsNotEmpty()
    readonly value!: number;

    @IsUUID()
    readonly categoryId?: string;

    @IsDate()
    readonly date!: Date;

    @IsUUID()
    @IsNotEmpty()
    readonly groupId!: string;
}

