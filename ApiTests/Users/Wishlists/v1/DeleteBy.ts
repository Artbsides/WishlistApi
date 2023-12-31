import { HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { of } from "rxjs";
import { App } from "ApiTests/App";
import { requests } from "ApiTests/Data/v1/Requests";
import { products } from "ApiTests/Data/v1/Products";
import { headers } from "ApiTests/Data/v1/Headers";
import { payload } from "ApiTests/Data/v1/Data";

export const WishlistDeleteV1 = () => describe("Delete", () => {
  const app = new App;

  const mockAxiosResponse = { ...requests.response,
    data: products.data[0]
  };

  let token: string;
  let httpService: HttpService;
  let id: string;

  beforeAll(async () => {
    const module = await app
      .create();

    httpService = module.get<HttpService>(HttpService);

    await app.server.inject({ method: "POST", url: "/users/account", headers, payload }).then(response =>
      token = `Bearer ${response.headers["access-token"]}`);

    jest.spyOn(httpService, "get")
      .mockImplementationOnce(() => of(mockAxiosResponse));

    await app.server.inject({method: "POST", url: "/users/wishlist",
      headers: { ...headers,
        authorization: token
      },
      payload: {
        id: mockAxiosResponse.data.id
      }
    })
    .then(response => {
      id = response.json().id;
    });
  });

  describe("DELETE users/wishlist", () => {
    it("Should return not found", async () => {
      await app.server.inject({ method: "DELETE", url: `/users/wishlist/${id}`}).then(response => {
        expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
        expect(response.payload).not.toBeNull();
      });

      await app.server.inject({ method: "DELETE", url: `/users/wishlist/${id}`,
        headers: { ApiKey: headers.ApiKey }}).then(response => {
          expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
          expect(response.payload).not.toBeNull();
      });
    });

    it("Should return unauthorized", async () => {
      await app.server.inject({ method: "DELETE", url: `/users/wishlist/${id}`,
        headers: { ApiVersion: headers.ApiVersion }}).then(response => {
          expect(response.statusCode).toEqual(HttpStatus.UNAUTHORIZED);
          expect(response.payload).not.toBeNull();
      });
    });

    it("Should return forbidden", async () => {
      await app.server.inject({ method: "DELETE", url: `/users/wishlist/${id}`, headers }).then(response => {
        expect(response.statusCode).toEqual(HttpStatus.FORBIDDEN);
        expect(response.payload).not.toBeNull();
      });
    });

    it("Should return no found", async () => {
      headers.Authorization = token;

      await app.server.inject({ method: "DELETE", url: `/users/wishlist/${mockAxiosResponse.data.id}`,
        headers
      })
      .then(response => {
        expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
        expect(response.payload).not.toBeNull();
      });
    });

    it("Should return no content", async () => {
      await app.server.inject({ method: "DELETE", url: `/users/wishlist/${id}`, headers }).then(response => {
        expect(response.statusCode).toEqual(HttpStatus.NO_CONTENT);
        expect(response.payload).toBe("");
      });
    });
  });

  afterAll(async () => {
    headers.Authorization = null;

    await app.server
      .close();
  });
});
