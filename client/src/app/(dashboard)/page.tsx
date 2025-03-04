import { protectServer } from "@/lib/protectServer";

export default async function Home() {
  await protectServer(); // Ensure user is authenticated

  return (
    <div className="flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
      {/* <Banner />
      <TemplatesSection />
      <ProjectsSection /> */}
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
    </div>
  );
}
