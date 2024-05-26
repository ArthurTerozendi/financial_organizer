'use client'

import { Input } from "@/components/input";

const Importation = () => {
    return (
      <div className="flex flex-row w-full">
        <div className="flex gap-8 flex-col mt-8 w-2/5 h-full">
          <Input label="Descrição" value="" onChange={() => {}} type="text" />
          <Input label="Categoria" value="" onChange={() => {}} type="text" />
          <Input label="Valor" value="" onChange={() => {}} type="text" />
          <Input label="Data" value="" onChange={() => {}} type="date" />
          <div className="flex justify-end items-start">
            <button className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm"> Criar </button>
          </div>
        </div>
        <div className="flex justify-end items-start w-3/5 mt-8 pr-2">
          <button className="bg-purple py-1 px-4 text-white rounded font-semibold text-sm"> Importar OFX </button>
        </div>
      </div>
    );
  }
  
  export default Importation;