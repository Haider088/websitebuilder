import { useState, useCallback } from 'react';
import { Asset, AssetCategory } from '../types';

const ASSETS_STORAGE_KEY = 'restaurant-builder-assets';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit for localStorage

interface UseAssetsReturn {
  assets: Asset[];
  addAsset: (file: File, category: AssetCategory) => Promise<Asset>;
  addAssetFromUrl: (url: string, name: string, category: AssetCategory) => Asset;
  deleteAsset: (id: string) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  getAssetsByCategory: (category: AssetCategory) => Asset[];
  trackAssetUsage: (assetId: string, componentId: string) => void;
  untrackAssetUsage: (assetId: string, componentId: string) => void;
}

function loadAssetsFromStorage(): Asset[] {
  try {
    const saved = localStorage.getItem(ASSETS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load assets:', error);
  }
  return [];
}

function saveAssetsToStorage(assets: Asset[]) {
  try {
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
  } catch (error) {
    console.error('Failed to save assets:', error);
    throw new Error('Failed to save asset. Storage quota may be exceeded.');
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useAssets(): UseAssetsReturn {
  const [assets, setAssets] = useState<Asset[]>(loadAssetsFromStorage());

  const updateAssetsState = useCallback((newAssets: Asset[]) => {
    setAssets(newAssets);
    saveAssetsToStorage(newAssets);
  }, []);

  const addAsset = useCallback(async (file: File, category: AssetCategory): Promise<Asset> => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are supported');
    }

    const base64 = await fileToBase64(file);
    
    const newAsset: Asset = {
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      url: base64,
      category,
      size: file.size,
      type: file.type,
      uploadedAt: Date.now(),
      usedIn: [],
    };

    const newAssets = [...assets, newAsset];
    updateAssetsState(newAssets);
    
    return newAsset;
  }, [assets, updateAssetsState]);

  const addAssetFromUrl = useCallback((url: string, name: string, category: AssetCategory): Asset => {
    const newAsset: Asset = {
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      url,
      category,
      size: 0,
      type: 'image/url',
      uploadedAt: Date.now(),
      usedIn: [],
    };

    const newAssets = [...assets, newAsset];
    updateAssetsState(newAssets);
    
    return newAsset;
  }, [assets, updateAssetsState]);

  const deleteAsset = useCallback((id: string) => {
    const newAssets = assets.filter((asset) => asset.id !== id);
    updateAssetsState(newAssets);
  }, [assets, updateAssetsState]);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    const newAssets = assets.map((asset) =>
      asset.id === id ? { ...asset, ...updates } : asset
    );
    updateAssetsState(newAssets);
  }, [assets, updateAssetsState]);

  const getAssetsByCategory = useCallback((category: AssetCategory): Asset[] => {
    if (category === 'all') return assets;
    return assets.filter((asset) => asset.category === category);
  }, [assets]);

  const trackAssetUsage = useCallback((assetId: string, componentId: string) => {
    const newAssets = assets.map((asset) => {
      if (asset.id === assetId && !asset.usedIn.includes(componentId)) {
        return { ...asset, usedIn: [...asset.usedIn, componentId] };
      }
      return asset;
    });
    updateAssetsState(newAssets);
  }, [assets, updateAssetsState]);

  const untrackAssetUsage = useCallback((assetId: string, componentId: string) => {
    const newAssets = assets.map((asset) => {
      if (asset.id === assetId) {
        return { ...asset, usedIn: asset.usedIn.filter((id) => id !== componentId) };
      }
      return asset;
    });
    updateAssetsState(newAssets);
  }, [assets, updateAssetsState]);

  return {
    assets,
    addAsset,
    addAssetFromUrl,
    deleteAsset,
    updateAsset,
    getAssetsByCategory,
    trackAssetUsage,
    untrackAssetUsage,
  };
}
