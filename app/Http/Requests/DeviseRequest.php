<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DeviseRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code'=>'required|string',
            'code'=>'required|string',
            'symbole'=>'required|string',
            'taux_achat'=>'required|numeric|min:0',
            'taux_vente'=>'required|numeric|min:0',
            'is_default'=>'boolean',
        ];
    }
}
