import os
import time
import requests
from ddgs import DDGS

FOOD_ITEMS = [
    "Add the food items you want to scrape here, e.g., pizza, sushi, burger, salad, pasta, tacos, ice cream, chocolate, steak, sandwich",
]

IMAGES_PER_FOOD = 25
BASE_DIR = "food_images"


def safe(name):
    return name.lower().replace(" ", "_")


def download(url, path):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            with open(path, "wb") as f:
                f.write(response.content)
            return True
        return False
    except:
        return False


def download_images(food, n):
    folder = os.path.join(BASE_DIR, safe(food))
    os.makedirs(folder, exist_ok=True)

    print(f"\n🍽️ Downloading: {food}")
    print(f"📁 Folder: {folder}")

    count = 0

    with DDGS() as ddgs:
        # IMPORTANT: use query= not keywords=
        results = ddgs.images(
            query=food,
            max_results=n * 5  # get more, we filter down
        )

        for result in results:
            if count >= n:
                break

            img_url = result.get("image")

            if not img_url:
                continue

            ext = ".jpg"
            for e in [".jpg", ".jpeg", ".png", ".webp"]:
                if e in img_url.lower():
                    ext = e
                    break

            fname = f"{safe(food)}_{count+1}{ext}"
            save_path = os.path.join(folder, fname)

            print(f"  [{count+1}/{n}] {img_url}")

            if download(img_url, save_path):
                count += 1

            time.sleep(1)  # avoid rate-limit

    print(f"Finished {food}: {count} images downloaded.")


def main():
    os.makedirs(BASE_DIR, exist_ok=True)

    for food in FOOD_ITEMS:
        download_images(food, IMAGES_PER_FOOD)

    print("\nALL DOWNLOADS COMPLETE")


if __name__ == "__main__":
    main()
