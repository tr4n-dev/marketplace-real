"use client"

import { toggleFavorite } from "@/lib/actions/favorites";
import { Heart } from "lucide-react"
import { useState, useTransition } from "react";

type Props = {
	annonceId: string;
	initialLiked?: boolean;
}
export function FavoriteIcon({ annonceId, initialLiked = false }: Props) {

	const [liked, setLiked] = useState(initialLiked);
	const [isPending, startTransition] = useTransition();

	const handleClick = () => {
		const previous = liked;

		setLiked(!previous);
		// if (session?.user) {
		// 	toggleFavorite({ userId: session?.user?.id, annonceId: annonceId });
		// }

		startTransition(async () => {
			await toggleFavorite({ annonceId: annonceId });
		});
	}
	return <button onClick={handleClick} disabled={isPending} className="p-2 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors">
		<Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
	</button>
}