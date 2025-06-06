<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:categories,name' . 
                     ($this->category ? ',' . $this->category->id : ''),
            'description' => 'nullable|string|max:500',
        ];
    }
}