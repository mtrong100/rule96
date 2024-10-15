import React, { useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";

const Upload = () => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    tags: [],
    categories: [],
    thumbnail: "",
    video: "",
  });

  return (
    <div className="">
      <form action="">
        <div className="grid grid-cols-2 gap-10">
          <section className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="capitalize" htmlFor="title">
                title
              </label>
              <InputText
                id="title"
                placeholder="Enter your title..."
                value={videoForm.title}
                onChange={(e) =>
                  setVideoForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="capitalize" htmlFor="description">
                description
              </label>
              <InputTextarea
                value={videoForm.description}
                onChange={(e) =>
                  setVideoForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={5}
                cols={30}
                placeholder="Enter your description..."
              />
            </div>

            <Divider />

            {/* categories */}
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="capitalize" htmlFor="categories">
                  select categories (limit 3)
                </label>
                <MultiSelect
                  value={videoForm.categories}
                  onChange={(e) =>
                    setVideoForm((prev) => ({
                      ...prev,
                      categories: e.value,
                    }))
                  }
                  options={["test1", "test2", "test3"]}
                  // optionLabel="name"
                  placeholder="Select your categories..."
                  maxSelectedLabels={3}
                />
                <p className="text-gray-400">
                  In case if you can not find your category, just simply create
                  new one at below
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="capitalize" htmlFor="tags">
                  select tags (limit 5)
                </label>
                <MultiSelect
                  value={videoForm.tags}
                  onChange={(e) =>
                    setVideoForm((prev) => ({
                      ...prev,
                      tags: e.value,
                    }))
                  }
                  options={["test1", "test2", "test3"]}
                  // optionLabel="name"
                  placeholder="Select your tags..."
                  maxSelectedLabels={3}
                />
                <p className="text-gray-400">
                  In case if you can not find your tags, just simply create new
                  one at below
                </p>
              </div>
            </div>

            <Divider />

            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="capitalize" htmlFor="category">
                  create new category
                </label>
                <div className="flex items-center gap-2">
                  <InputText
                    id="category"
                    placeholder="Enter your new category..."
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    label="Create new"
                    icon="pi pi-plus"
                    className="h-[50px]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="capitalize" htmlFor="category">
                  create new tag
                </label>
                <div className="flex items-center gap-2">
                  <InputText
                    id="tag"
                    placeholder="Enter your new tag..."
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    label="Create new"
                    icon="pi pi-plus"
                    className="h-[50px]"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="capitalize" htmlFor="Thumbnail">
                Thumbnail
              </label>
              <input
                type="file"
                name="Thumbnail"
                id="Thumbnail"
                accept="image/*"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="capitalize" htmlFor="video">
                video
              </label>
              <input type="file" name="video" id="video" accept="video/*" />
            </div>
          </section>
        </div>

        <Divider />

        <div className="flex items-center justify-end gap-3 ">
          <Button
            type="button"
            label="Discard"
            loading={loading}
            disabled={loading}
            icon="pi pi-trash"
            severity="danger"
          />
          <Button
            type="submit"
            label="Confirm Upload"
            loading={loading}
            disabled={loading}
            icon="pi pi-upload"
            severity="success"
          />
        </div>
      </form>
    </div>
  );
};

export default Upload;
