import supertest from "supertest";
import { web } from "../src/app/web";
import { prismaClient } from "../src/app/database";
import { logger } from "../src/app/logging";

describe("User Test", () => {
    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: "bagus",
            },
        });
    });

    it("Register User Test", async () => {
        const result = await supertest(web).post("/api/users").send({
            username: "bagus",
            password: "12345",
            name: "Bagus Syafiq",
        });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("bagus");
        expect(result.body.data.name).toBe("Bagus Syafiq");
        expect(result.body.data.password).toBeUndefined();
    });

    it("should reject if request invalid", async () => {
        const result = await supertest(web).post("/api/users").send({
            username: "",
            password: "",
            name: "",
        });

        logger.info(result.body);

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeUndefined;
    });
});
