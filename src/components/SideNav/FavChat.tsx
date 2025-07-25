import { StarIcon } from "assets/icons/StarIcon";
import { StarIconSolid } from "assets/icons/StarSolidIcon";
import { useChats } from "hooks/features/Chat/useChats";
import { useAppStoreUpdateChatFav } from "store/useAppStore";

type Props = {
  id: string;
  fav: boolean;
};

export const FavChat = ({ id, fav }: Props) => {
  const updateChatFav = useAppStoreUpdateChatFav();
  const { toggleChatFav } = useChats();

  const toggleFav = async () => {
    try {
      await toggleChatFav(id);
      updateChatFav(id, !fav);
    } catch {
      console.error("Error toggling favorite chat status");
    }
  };

  return (
    <>
      {fav ? (
        <StarIconSolid
          className="size-5 mt-2 cursor-pointer"
          aria-label="Unfavorite chat"
          onClick={toggleFav}
        />
      ) : (
        <StarIcon className="size-5 mt-2 cursor-pointer" aria-label="Favorite chat" onClick={toggleFav} />
      )}
    </>
  );
};
