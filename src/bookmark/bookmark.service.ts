import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private readonly prisma: PrismaService){}
    async create(userId: number, createBookmarkDto: CreateBookmarkDto) {
        const bookmark = await this.prisma.bookmark.create({
          data: {
            title: createBookmarkDto.title,
            description: createBookmarkDto.description,
            link: createBookmarkDto.link,
            user: {
              connect: { id: userId }, // Use `connect` to link the user
            },
          },
        });
        return bookmark;
      }
    
    async getBookmarks(userId:number){
        return this.prisma.bookmark.findMany({
            where:{
                userId
            }
        })
    }
    async getBookmarkById(userId:number,bookmarkId:number){
        return this.prisma.bookmark.findFirst({
            where:{
                userId,
                id:bookmarkId
            }
        })
    }
    async editBookmarkById(userId:number,bookmarkId:number,editBookmarkDto:EditBookmarkDto){
        console.log(editBookmarkDto)
        const bookmark = await this.prisma.bookmark.findUnique({
            where:{
                id:bookmarkId
            }
        })
        
        if(!bookmark || bookmark.userId !== userId) throw new HttpException("Acess this resourced denied",HttpStatus.UNAUTHORIZED)
            const updateResult = await this.prisma.bookmark.update({
                where: { id: bookmarkId },
                data: {
                  ...editBookmarkDto
                }
              });
              
              return updateResult;
            
            
    }
    async deleteBookmarkById(userId:number,bookmarkId:number){
        const bookmark = await this.prisma.bookmark.findUnique({
            where:{
                id:bookmarkId
            }
        })
        
        if(!bookmark || bookmark.userId !== userId) throw new HttpException("Acess this resourced denied",HttpStatus.UNAUTHORIZED)
        return await this.prisma.bookmark.deleteMany({
            where:{
                id:bookmarkId,
            }
        })
    }
}
