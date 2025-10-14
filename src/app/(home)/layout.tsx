import { FilterStoreProvider } from "@/providers/filter-store";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return <FilterStoreProvider>{children}</FilterStoreProvider>;
};

export default HomeLayout;
