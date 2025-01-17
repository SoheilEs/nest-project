import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from '../auth/guard';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { GetUser } from '../auth/decorator';
@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkServive:BookmarkService){}

    @Post("create")
    createBookmark(@GetUser('id') userId:number, @Body() createBookmarkDto:CreateBookmarkDto){
        return this.bookmarkServive.create(userId,createBookmarkDto)

    }
    @HttpCode(HttpStatus.OK)
    @Get("list")
    getBookmarks(@GetUser('id') userId:number){
     
        
        return this.bookmarkServive.getBookmarks(userId)
    }
    @Get(":id")
    getBookmarkById(@Param('id',ParseIntPipe) bookmarkId:number,@GetUser('id') userId:number){
        return this.bookmarkServive.getBookmarkById(userId,bookmarkId)
    }
    @Patch("edit/:id")
    editBookmarkById(@Body() editBookmarkDto:EditBookmarkDto,@Param('id',ParseIntPipe) bookmarkId:number,@GetUser('id') userId:number){

        return this.bookmarkServive.editBookmarkById(userId,bookmarkId,editBookmarkDto)
    }
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete("delete/:id")
    deleteBookmarkById(@Param('id',ParseIntPipe) bookmarkId:number,@GetUser('id') userId:number){
        return this.bookmarkServive.deleteBookmarkById(userId,bookmarkId)
    }
}
