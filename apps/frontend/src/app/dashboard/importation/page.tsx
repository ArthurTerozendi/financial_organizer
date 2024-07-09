'use client'

import { Input } from "@/components/input";
import { useApi } from "@/services/api";
import { ApiRoutes } from "@/services/routes";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";
import { TransactionForm } from "./types";

const Importation = () => {
  const router = useRouter();
  const { postRequest } = useApi(router);

  const [form, setForm] = useState<TransactionForm>({
    date: '',
    description: '',
    tag: '',
    type: 'Credit',
    value: 0,
  })

  const handleFormChange = useCallback((value: string | number, key: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, [setForm])

  const handleFormSubmit = useCallback(async (e: any) => {
    e.preventDefault();
    
    if (!form) return;

    const response = await postRequest<
      TransactionForm,
      TransactionForm>
    (ApiRoutes.transaction.create, {
        description: form.description,
        tag: form.tag,
        value: form.value,
        date: form.date,
        type: form.type,
    });

    console.log(response)
  }, [postRequest, form]);


  const handleUploadSubmit = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

     if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await postRequest<FormData, any>(ApiRoutes.transaction.uploadFile, formData)

      console.log(response);
    }
  }, [postRequest])

  return (
    <div className="flex flex-row w-full">
      <form className="flex gap-8 flex-col mt-8 w-2/6 h-full" onSubmit={handleFormSubmit}>
        <Input label="Descrição" value={form.description} onChange={(e) => handleFormChange(e.target.value, 'description')} type="text" />
        <Input label="Categoria" value={form.tag} onChange={(e) => handleFormChange(e.target.value, 'tag')} type="text" />
        <div className="flex flex-row gap-3 items-center">
          <div className="w-1/2">
            <Input label="Valor" value={form.value} onChange={(e) => handleFormChange(e.target.valueAsNumber, 'value')} type="number" />
          </div>
          <div className="w-1/2 flex flex-row gap-2 mt-4">
            <Input label="Crédito" onChange={(e) => handleFormChange(e.target.value, 'type')} type="radio" name="type" value={form.type} />
            <Input label="Débito" onChange={(e) => handleFormChange(e.target.value, 'type')} type="radio" name="type" value={form.type} />
          </div>
        </div>
        <Input label="Data" value={form.date} onChange={(e) => handleFormChange(e.target.value, 'date')} type="datetime-local" />
        <div className="flex justify-end items-start">
          <button className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm" onClick={(e) => handleFormSubmit(e)} > Criar </button>
        </div>
      </form>
      <div className="flex justify-end items-start w-4/6 mt-8 pr-2">
        <label htmlFor="uploadFile" className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm cursor-pointer" title="Importar arquivo OFX">Importar Extrato </label>
        <input id='uploadFile' name="bankStatement" type="file" onChange={handleUploadSubmit} hidden={true} accept=".ofx"/>
      </div>
    </div>
  );
}

export default Importation;