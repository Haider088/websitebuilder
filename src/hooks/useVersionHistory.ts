import { useState, useEffect, useCallback } from 'react';
import { ProjectVersion, Page, GlobalSettings } from '../types';

const VERSIONS_STORAGE_KEY = 'restaurant-builder-versions';
const MAX_VERSIONS = 50; // Keep last 50 versions
const MAX_AUTO_SAVES = 10; // Keep last 10 auto-saves

export interface VersionHistoryState {
  pages: Page[];
  currentPageId: string;
  siteName: string;
  globalSettings: GlobalSettings;
}

export function useVersionHistory() {
  const [versions, setVersions] = useState<ProjectVersion[]>([]);

  // Load versions from localStorage on mount
  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = useCallback(() => {
    try {
      const saved = localStorage.getItem(VERSIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setVersions(parsed);
      }
    } catch (error) {
      console.error('Failed to load versions:', error);
    }
  }, []);

  const saveVersionsToStorage = useCallback((newVersions: ProjectVersion[]) => {
    try {
      localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(newVersions));
      setVersions(newVersions);
    } catch (error) {
      console.error('Failed to save versions:', error);
      // If storage is full, try cleaning old auto-saves
      cleanOldAutoSaves(newVersions);
    }
  }, []);

  const cleanOldAutoSaves = useCallback((versionList: ProjectVersion[]) => {
    // Keep manual saves and only the most recent auto-saves
    const manualSaves = versionList.filter(v => !v.isAutoSave);
    const autoSaves = versionList
      .filter(v => v.isAutoSave)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_AUTO_SAVES);
    
    const cleaned = [...manualSaves, ...autoSaves].sort((a, b) => b.timestamp - a.timestamp);
    
    try {
      localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(cleaned));
      setVersions(cleaned);
    } catch (error) {
      console.error('Failed to clean old versions:', error);
    }
  }, []);

  const saveVersion = useCallback((
    state: VersionHistoryState,
    name?: string,
    description?: string,
    isAutoSave = false
  ): ProjectVersion => {
    const componentCount = state.pages.reduce((sum, page) => sum + page.components.length, 0);
    
    const newVersion: ProjectVersion = {
      id: `version-${Date.now()}`,
      name: name || (isAutoSave ? 'Auto-save' : `Version ${versions.length + 1}`),
      description,
      timestamp: Date.now(),
      isAutoSave,
      state: {
        pages: state.pages,
        currentPageId: state.currentPageId,
        siteName: state.siteName,
        globalSettings: state.globalSettings,
      },
      componentCount,
      pageCount: state.pages.length,
    };

    let updatedVersions = [newVersion, ...versions];

    // Limit total versions
    if (updatedVersions.length > MAX_VERSIONS) {
      // Remove oldest auto-saves first
      const manualSaves = updatedVersions.filter(v => !v.isAutoSave);
      const autoSaves = updatedVersions
        .filter(v => v.isAutoSave)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, MAX_AUTO_SAVES);
      
      updatedVersions = [...manualSaves, ...autoSaves].sort((a, b) => b.timestamp - a.timestamp);
    }

    saveVersionsToStorage(updatedVersions);
    return newVersion;
  }, [versions, saveVersionsToStorage]);

  const restoreVersion = useCallback((versionId: string): VersionHistoryState | null => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return null;

    return version.state;
  }, [versions]);

  const deleteVersion = useCallback((versionId: string) => {
    const updatedVersions = versions.filter(v => v.id !== versionId);
    saveVersionsToStorage(updatedVersions);
  }, [versions, saveVersionsToStorage]);

  const deleteAllVersions = useCallback(() => {
    saveVersionsToStorage([]);
  }, [saveVersionsToStorage]);

  const compareVersions = useCallback((version1Id: string, version2Id: string) => {
    const v1 = versions.find(v => v.id === version1Id);
    const v2 = versions.find(v => v.id === version2Id);

    if (!v1 || !v2) return null;

    // Simple comparison based on component and page counts
    const componentDiff = v1.componentCount - v2.componentCount;
    const pageDiff = v1.pageCount - v2.pageCount;

    // Find changed pages
    const pagesChanged = v1.state.pages
      .filter(p1 => {
        const p2 = v2.state.pages.find(p => p.id === p1.id);
        return !p2 || p1.components.length !== p2.components.length;
      })
      .map(p => p.name);

    return {
      added: Math.max(0, componentDiff),
      removed: Math.max(0, -componentDiff),
      modified: 0, // Would require deep comparison
      pagesChanged,
    };
  }, [versions]);

  const getVersionStats = useCallback(() => {
    const manualCount = versions.filter(v => !v.isAutoSave).length;
    const autoCount = versions.filter(v => v.isAutoSave).length;
    const totalSize = new Blob([JSON.stringify(versions)]).size;

    return {
      total: versions.length,
      manual: manualCount,
      auto: autoCount,
      sizeInBytes: totalSize,
      sizeInMB: (totalSize / (1024 * 1024)).toFixed(2),
    };
  }, [versions]);

  return {
    versions,
    saveVersion,
    restoreVersion,
    deleteVersion,
    deleteAllVersions,
    compareVersions,
    getVersionStats,
    loadVersions,
  };
}
