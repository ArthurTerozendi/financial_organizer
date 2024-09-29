"use client";

import { Input } from "../../components/input";
import { useApi } from "../../services/api";
import { ApiRoutes } from "../../services/routes";
import { ChangeEvent, FC, useCallback, useState } from "react";
import { TransactionForm } from "./types";
import { useNavigate } from "react-router-dom";
import { PageEnum, Pages } from "../../components/sidebar/types";
import DashboardLayout from "../../layouts/dashboard";

const Importation: FC = () => {
  const navigate = useNavigate();
  const { postRequest } = useApi(navigate);

  const [form, setForm] = useState<TransactionForm>({
    date: "",
    description: "",
    tag: "",
    type: "Credit",
    value: 0,
  });

  const handleFormChange = useCallback(
    (value: string | number, key: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [setForm],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = useCallback(
    async (e: any) => {
      e.preventDefault();

      if (!form) return;

      await postRequest<TransactionForm, TransactionForm>(
        ApiRoutes.transaction.create,
        {
          description: form.description,
          tag: form.tag,
          value: form.value,
          date: form.date,
          type: form.type,
        },
      );
    },
    [postRequest, form],
  );

  const handleUploadSubmit = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await postRequest<FormData, unknown>(
          ApiRoutes.transaction.uploadFile,
          formData,
        );
      }
    },
    [postRequest],
  );

  return (
    <DashboardLayout
      currentPage={PageEnum.Importations}
      title={Pages[PageEnum.Importations].label}
    >
      <div className="flex flex-row w-full">
        <form
          className="flex gap-8 flex-col mt-8 w-2/6 h-full"
          onSubmit={handleFormSubmit}
        >
          <Input
            label="Descrição"
            value={form.description}
            onChange={(e) => handleFormChange(e.target.value, "description")}
            type="text"
          />
          <Input
            label="Categoria"
            value={form.tag}
            onChange={(e) => handleFormChange(e.target.value, "tag")}
            type="text"
          />
          <div className="flex flex-row gap-3 items-center">
            <div className="w-1/2">
              <Input
                label="Valor"
                value={form.value}
                onChange={(e) =>
                  handleFormChange(e.target.valueAsNumber, "value")
                }
                type="number"
              />
            </div>
            <div className="w-1/2 flex flex-row gap-2 mt-4">
              <Input
                label="Crédito"
                onChange={(e) => handleFormChange(e.target.value, "type")}
                type="radio"
                name="type"
                value={form.type}
              />
              <Input
                label="Débito"
                onChange={(e) => handleFormChange(e.target.value, "type")}
                type="radio"
                name="type"
                value={form.type}
              />
            </div>
          </div>
          <Input
            label="Data"
            value={form.date}
            onChange={(e) => handleFormChange(e.target.value, "date")}
            type="datetime-local"
          />
          <div className="flex justify-end items-start">
            <button
              className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm"
              onClick={(e) => handleFormSubmit(e)}
            >
              {" "}
              Criar{" "}
            </button>
          </div>
        </form>
        <div className="flex justify-end items-start w-4/6 mt-8 pr-2">
          <label
            htmlFor="uploadFile"
            className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm cursor-pointer"
            title="Importar arquivo OFX"
          >
            Importar Extrato{" "}
          </label>
          <input
            id="uploadFile"
            name="bankStatement"
            type="file"
            onChange={handleUploadSubmit}
            hidden={true}
            accept=".ofx"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Importation;
