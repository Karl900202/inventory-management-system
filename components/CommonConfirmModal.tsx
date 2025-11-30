"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, memo } from "react";

type Props = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

function CommonConfirmModal({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/40" />

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
            <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>

            <p className="text-gray-600 mt-2">{description}</p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                {cancelText}
              </button>

              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {confirmText}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}

export default memo(CommonConfirmModal);
