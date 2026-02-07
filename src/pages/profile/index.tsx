import type { NextPage } from "next";
import { useRouter } from "next/router";
import { NotFound } from "../../components/not-found/not-found.component";
import { Profile } from "../../components/profile/profile.component";

const ProfilePage: NextPage = () => {
  const { query } = useRouter();

  const id = query.id;

  return typeof id === "string" ? <Profile id={id} /> : <NotFound />;
};

export default ProfilePage;
