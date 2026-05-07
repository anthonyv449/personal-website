import { loader } from "../index";

test("loader resolves without throwing", async () => {
  await expect(loader()).resolves.toBeUndefined();
});
