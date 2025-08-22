import EventSearch from "@/components/EventSearch";
import { apiGet } from "@/lib/api/axios";

export default async function HomePage() {
  const { data, error } = await apiGet("/filter");

  return (
    <EventSearch locations={data.locations} categories={data.categories} />
  );
}
