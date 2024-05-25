'use client'

import { Input } from "@/components/input";

const Importation = () => {
    return (
      <div className="flex gap-8 flex-col mt-8 w-64 h-full">
        <Input label="Descrição" value="" onChange={() => {}} type="text" />
        <Input label="Categoria" value="" onChange={() => {}} type="text" />
        <Input label="Valor" value="" onChange={() => {}} type="text" />
        <Input label="Data" value="" onChange={() => {}} type="date" />

        <button className="bg-purple py-1 text-white rounded font-semibold text-sm"> Criar </button>
      </div>
    );
  }
  
  export default Importation;