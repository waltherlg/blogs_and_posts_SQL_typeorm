import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { S3StorageAdapter } from "../../../adapters/file-storage-adapter";
import { CheckService } from "../../../other.services/check.service";
import { ActionResult } from "../../../helpers/enum.action.result.helper";


export class BloggerUploadMainForPostCommand {
    constructor(
        public userId,
        public blogId,
        public postId,
        public postMainFile,
        public metadata
    ){}
}

@CommandHandler(BloggerUploadMainForPostCommand)
export class BloggerUploadMainForPostUseCase 
implements ICommandHandler<BloggerUploadMainForPostCommand>
{
    constructor(
        private readonly s3StorageAdapter: S3StorageAdapter,
        private readonly checkService: CheckService
    ) {}

    async execute(command: BloggerUploadMainForPostCommand){
        const userId = command.userId;
        const blogId = command.blogId;
        const postId = command.postId;
        const buffer = command.postMainFile.buffer;
        const metadata = command.metadata;

        if(!(await this.checkService.isUserOwnerOfBlog(userId, blogId))){
            return ActionResult.NotOwner
        }

        try{
            const uploadedMainKey = await this.s3StorageAdapter.savePostMain(
                userId,
                blogId,
                postId,
                buffer,
                metadata
            )
            const main = [{
                url: uploadedMainKey,
                width: command.metadata.width,
                height: command.metadata.height,
                fileSize: command.metadata.size,
            }]
            return main

        } catch (error){
            return ActionResult.NotCreated
        }


    }
}