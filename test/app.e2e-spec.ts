import {Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AllExceptionsFilter } from "../src/common/filters/all-exceptions.filter";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum"
import { SignupAuthDto } from "../src/auth/dto/signup-auth.dto";
import { SigninAuthDto } from "src/auth/dto/sigin-auth.dto";
import { EditUserDto } from "src/auth/dto/edit-user.dto";
describe('App e2e',()=>{
  let app: INestApplication
  let prisma: PrismaService
  beforeAll(async()=>{
    const moduleRef = await Test.createTestingModule({
      imports:[AppModule]
    }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({
      whitelist:true
    }))
    app.useGlobalFilters(new AllExceptionsFilter())
    app.init()
    await app.listen(3333)
    prisma = app.get(PrismaService)
    await prisma.cleanDB()
    pactum.request.setBaseUrl("http://localhost:3333")
  })
  afterAll(()=>{
    app.close()
  })
  describe("Auth",()=>{
    describe('Signup',()=>{
      const dto : SignupAuthDto = {
        email:"testUser@test.com",
        firstname:"TEST USER",
        lastname:"TESTER",
        password: "1234567"
      }
      it("Should throw if firstname empty",()=>{
        return pactum.spec().post("/auth/signin").withBody({
          lastname: dto.lastname,
          email: dto.email,
          password: dto.password
        }).expectStatus(400)
      })
      it("Should throw if lastname empty",()=>{
        return pactum.spec().post("/auth/signin").withBody({
          firestname: dto.firstname,
          email: dto.email,
          password: dto.password
        }).expectStatus(400)
      })
      it("Should throw if password empty",()=>{
        return pactum.spec().post("/auth/signin").withBody({
          email:dto.email
        }).expectStatus(400)
      })
      it("Should throw if no body present",()=>{
        return pactum.spec().post("/auth/signin").expectStatus(400)
      })
      it("Should signup",()=>{
       
        return pactum.spec().post("/auth/signup").withBody(dto).expectStatus(201)
      })
    })
    describe('Signin',()=>{
      const dto : SigninAuthDto = {
        email: "testUser@test.com",
        password:"1234567"
      }
      it("Should throw if email empty",()=>{
        return pactum.spec().post("/auth/signin").withBody({
          password:dto.password
        }).expectStatus(400)
      })
      it("Should throw if password empty",()=>{
        return pactum.spec().post("/auth/signin").withBody({
          email:dto.email
        }).expectStatus(400)
      })
      it("Should throw if no body present",()=>{
        return pactum.spec().post("/auth/signin").expectStatus(400)
      })
      it("Should signin",()=>{
        return pactum.spec().post("/auth/signin").withBody(dto).expectStatus(200).stores('userAt','accessToken')
      })
    })
  })
  describe("User",()=>{
    describe('Get current user',()=>{
      it("Should get current user",()=>{
        return pactum
        .spec()
        .get("/users/me")
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)

      })
    })
    describe('Edit user',()=>{
      const dto:EditUserDto={
        firstname:"Soheil_test",
        lastname:"Isazade_test",
        email:"soheil@test.com"
      }
      it("Should edit user",()=>{
        return pactum
        .spec()
        .patch("/users/edit")
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectBodyContains('firstName')
        .expectBodyContains(dto.lastname)
        .expectBodyContains(dto.email)
        .expectStatus(200)
      })
    })
  })
  describe("Bookmarks",()=>{
    describe('Get Bookmarks',()=>{
      it.todo("Should get bookmarks")
    })
    describe("Create Bookmark",()=>{
      it.todo("Should create bookmark")
    })
    describe("Get Bookmark by id",()=>{
      it.todo("Should get bookmark by id")
    })
    describe("Edit Bookmark by id",()=>{
      it.todo("Should edit bookmark")
    })
    describe("Delete Bookmark by id",()=>{
      it.todo("Should delete bookmark")
    })
  })
})