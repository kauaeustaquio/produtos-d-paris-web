import React, { useRef, useState } from 'react';
import { CircleX, Upload } from 'lucide-react';
import './CategoryFormModal.css'; 

export default function CategoryFormModal({ 
    onClose, 
    onSave, 
    newCategoryName, 
    setNewCategoryName, 
}) {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleNameChange = (e) => {
        setNewCategoryName(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleConfirm = (e) => {
        e.preventDefault();

        if (!newCategoryName.trim()) {
            alert("Nome da categoria é obrigatório.");
            return;
        }

        if (!selectedImage) {
            alert("Selecione uma imagem.");
            return;
        }

        // envia nome + imagem para o pai
        onSave({
            nome: newCategoryName,
            imagem: selectedImage
        });
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
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />

                    <div className="image-upload-area" onClick={() => fileInputRef.current.click()}>
                        <div className="upload-placeholder">
                            <Upload size={48} />
                            <p className="upload-text">
                                {selectedImage ? selectedImage.name : "Selecione a imagem"}
                            </p>
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
