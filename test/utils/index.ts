import { Session, User } from "@/entities";
import { AuthModule, UserModule } from "@/modules";
import { ModuleMetadata } from "@nestjs/common";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import supertest from "supertest";

interface IBeforeAllParameters {
    metadata?: ModuleMetadata;
}

export class TestBaseModule {

    module: TestingModule;
    httpRequest: supertest.SuperTest<supertest.Test>;

    private app: INestApplication;

    async beforeAll(params?: IBeforeAllParameters): Promise<void> {
        const moduleBuilder = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'database.sqlite',
                    synchronize: true,
                    logging: false,
                    entities: [User, Session],
                }),
                UserModule,
                AuthModule,
                ...(params?.metadata?.imports ?? [])
            ],
            controllers: [...(params?.metadata?.controllers ?? [])],
            providers: [...(params?.metadata?.providers ?? [])],
            exports: [...(params?.metadata?.providers ?? [])]
        });

        this.module = await moduleBuilder.compile();
        this.app = this.module.createNestApplication();

        await this.app.init();
        this.httpRequest = supertest(this.app.getHttpServer());

    }

    async afterAll(): Promise<void>{
        await this.app.close();
    }
}