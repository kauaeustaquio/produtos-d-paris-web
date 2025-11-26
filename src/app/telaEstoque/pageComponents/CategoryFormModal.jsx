import React, { useRef } from 'react';
import { CircleX, Upload } from 'lucide-react';
import './CategoryFormModal.css'; 

export default function CategoryFormModal({ 
    onClose, 
    onSave, 
    newCategoryName, 
    setNewCategoryName, 
}) {
    const fileInputRef = useRef(null);

    const handleNameChange = (e) => {
        setNewCategoryName(e.target.value);
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        onSave(); // Chama a função handleSaveCategory
    };

    return (
        <div className="modal-backdrop-category">
            <div className="modal-content-category">
                <button onClick={onClose} className="close-button-category">
                    <CircleX size={24} />
                </button>
                
                <h3 className="modal-title-category">Insira/remova uma categoria</h3>
                
                <form onSubmit={handleConfirm} className="category-form">
                    
                    <input
                        type="file"
                        ref={fileInputRef}
                        // Lógica de imagem removida, mas o input fica para o visual
                        style={{ display: 'none' }}
                        accept="image/*"
                    />

                    <div className="image-upload-area" onClick={() => fileInputRef.current.click()}>
                        <div className="upload-placeholder">
                            <Upload size={48} />
                            <p className="upload-text">Selecione a imagem somente para adição</p>
                        </div>
                    </div>
                    

                    <label htmlFor="categoryName" className="label-category">Nome da categoria:</label>
                    <input
                        id="categoryName"
                        type="text"
                        value={newCategoryName}
                        onChange={handleNameChange}
                        placeholder="Ex: Carros"
                        className="input-category-name"
                    />

                    <button type="submit" className="confirm-button-category">
                        Confirmar
                    </button>
                </form>
            </div>
        </div>
    );
}