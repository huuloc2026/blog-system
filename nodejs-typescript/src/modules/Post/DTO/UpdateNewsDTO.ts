import { Expose } from "class-transformer";
import { ArrayMaxSize, IsArray, IsDateString, IsEnum, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
export enum PostStatus {
    Draft = 'Draft',
    Published = 'Published',
    Deleted = 'Deleted'
}

export enum NewsCatogories {
    KINHTE = "kinh-te",
    THETHAO = "the-thao",
    CHINHTRI = "chinh-tri",
    THOITRANG = "thoi-trang",
}
export class Tag {
    @IsString()
    @MaxLength(125, { message: "Tag name cannot exceed 125 characters" })
    name: string;
}
export class UpdateNewsDTO {
    @Expose()
    @IsOptional()
    @MaxLength(250, { message: "title maxlength 250 character" })
    title: string;

    @Expose()
    @MaxLength(20000, { message: "20000 maxlength 20000 character" })
    content: string;


    @Expose()
    @IsOptional()
    @MaxLength(2048, { message: "thumbnail maxlength 250 character" })
    thumbnail: string;

    @Expose()
    @IsOptional()
    @IsEnum(NewsCatogories)
    @MaxLength(125, { message: "category maxlength 125 character" })
    category: NewsCatogories;

    @Expose()
    @IsOptional()
    @MaxLength(125, { message: "author maxlength 250 character" })
    author: string;

    @Expose()
    @IsOptional()
    @IsArray({ message: "Tags must be an array" })
    @ArrayMaxSize(125, { message: "Each tag can have a maximum of 125 characters" })
    @IsString({ each: true, message: "Each tag must be a string" })
    tags: Tag[];

    @Expose()
    @IsOptional()
    @IsEnum(PostStatus)
    status: PostStatus;

    @Expose()
    @IsOptional()
    @MaxLength(500, { message: "description maxlength 250 character" })
    description: string;
}
