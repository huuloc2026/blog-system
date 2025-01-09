import { NotFoundError } from "./ApiError";
import { HelpParseJSON } from "./HelpParseJSON";

export const HelperExtractId = (data: any, idInput: any): boolean => {

    const parsedData = HelpParseJSON(data);


    const extractedIds = parsedData.map((item: any) => item.id);

    const idExists = extractedIds.includes(idInput);


    if (!idExists) {
        console.log(`ID ${idInput} does not exist in the provided data.`);
        return false;
    }

    return true;
};
