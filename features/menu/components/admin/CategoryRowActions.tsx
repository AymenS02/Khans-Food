"use client";

import {
  useActionState,
} from "react";

import {
  updateCategory,
  type UpdateCategoryActionState,
} from "@/actions/menu/updateCategory";

import {
  deleteCategory,
  type DeleteCategoryActionState,
} from "@/actions/menu/deleteCategory";

interface CategoryRowActionsProps {
  id: string;
  name: string;
}

const initialUpdateState:
  UpdateCategoryActionState = {
    success: false,
    message: "",
  };

const initialDeleteState:
  DeleteCategoryActionState = {
    success: false,
    message: "",
  };

export default function CategoryRowActions({
  id,
  name,
}: CategoryRowActionsProps) {
  const [
    updateState,
    updateAction,
    updatePending,
  ] =
    useActionState(
      updateCategory,
      initialUpdateState
    );

  const [
    deleteState,
    deleteAction,
    deletePending,
  ] =
    useActionState(
      deleteCategory,
      initialDeleteState
    );

  const pending =
    updatePending ||
    deletePending;

  return (
    <div>
      {/* ======================================
          EDIT
      ====================================== */}

      <form
        action={
          updateAction
        }
        className="flex flex-col gap-2 sm:flex-row"
      >
        <input
          type="hidden"
          name="categoryId"
          value={id}
        />

        <div className="min-w-0 flex-1">
          <label
            htmlFor={`category-${id}`}
            className="sr-only"
          >
            Edit {name}
          </label>

          <input
            id={`category-${id}`}
            name="name"
            type="text"
            defaultValue={
              name
            }
            disabled={
              pending
            }
            className="w-full rounded-lg border border-black/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
          />

          {updateState
            .fieldErrors
            ?.name?.[0] && (
            <p className="mt-1 text-xs text-accent">
              {
                updateState
                  .fieldErrors
                  .name[0]
              }
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            pending
          }
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updatePending
            ? "Saving..."
            : "Save"}
        </button>
      </form>

      {updateState.message && (
        <p
          role={
            updateState.success
              ? "status"
              : "alert"
          }
          className={`mt-2 text-xs ${
            updateState.success
              ? "text-foreground/60"
              : "text-accent"
          }`}
        >
          {
            updateState.message
          }
        </p>
      )}

      {/* ======================================
          DELETE
      ====================================== */}

      <form
        action={
          deleteAction
        }
        onSubmit={(
          event
        ) => {
          const confirmed =
            window.confirm(
              `Delete "${name}"?`
            );

          if (!confirmed) {
            event.preventDefault();
          }
        }}
        className="mt-3"
      >
        <input
          type="hidden"
          name="categoryId"
          value={id}
        />

        <button
          type="submit"
          disabled={
            pending
          }
          className="text-sm font-semibold text-accent hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deletePending
            ? "Deleting..."
            : "Delete Category"}
        </button>
      </form>

      {deleteState.message && (
        <p
          role={
            deleteState.success
              ? "status"
              : "alert"
          }
          className={`mt-2 text-xs ${
            deleteState.success
              ? "text-foreground/60"
              : "text-accent"
          }`}
        >
          {
            deleteState.message
          }
        </p>
      )}
    </div>
  );
}