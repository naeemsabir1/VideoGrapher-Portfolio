'use client';

import React, { useState, useTransition } from 'react';
import { VideoItem, CategoryMeta } from '@/types';
import { addVideo, deleteVideo, updateVideo } from '@/app/admin/category/[slug]/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Edit2 } from 'lucide-react';
import Image from 'next/image';

interface CategoryManagerClientProps {
  category: CategoryMeta;
  videos: VideoItem[];
}

export function CategoryManagerClient({ category, videos }: CategoryManagerClientProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addErrors, setAddErrors] = useState<{ [key: string]: string }>({});
  const [editErrors, setEditErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (formData: FormData): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageKitUrl = formData.get('imageKitUrl') as string;

    if (!title || title.trim() === '') errors.title = 'Title is required';
    if (!description || description.trim() === '') errors.description = 'Description is required';
    if (!imageKitUrl || imageKitUrl.trim() === '') {
      errors.imageKitUrl = 'Video URL is required';
    } else if (!imageKitUrl.startsWith('https://ik.imagekit.io/')) {
      errors.imageKitUrl = 'URL must start with https://ik.imagekit.io/';
    }

    return errors;
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors);
      return;
    }
    
    setAddErrors({});
    startTransition(async () => {
      await addVideo(formData, category.slug);
      (e.target as HTMLFormElement).reset();
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteVideo(id);
    });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }
    
    setEditErrors({});
    const data: Partial<VideoItem> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      imageKitUrl: formData.get('imageKitUrl') as string,
      thumbnailUrl: (formData.get('thumbnailUrl') as string) || undefined,
      aspectRatio: formData.get('aspectRatio') as 'vertical' | 'horizontal',
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
      featured: formData.get('featured') === 'on'
    };
    
    startTransition(async () => {
      await updateVideo(id, data);
      setEditingId(null);
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[var(--bg-base)] shadow-sm flex items-center justify-center text-2xl">
          {category.emoji}
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">
            {category.label}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            {category.description}
          </p>
        </div>
      </div>

      {/* Add New Video Form */}
      <Card className="rounded-[20px] shadow-sm border-[var(--border-subtle)]">
        <CardHeader>
          <CardTitle className="font-display">Add New Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required placeholder="Video title" aria-invalid={!!addErrors.title} />
                {addErrors.title && <span className="text-xs text-red-500">{addErrors.title}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select name="aspectRatio" defaultValue="vertical">
                  <SelectTrigger>
                    <SelectValue placeholder="Select ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vertical">Vertical (9:16)</SelectItem>
                    <SelectItem value="horizontal">Horizontal (16:9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required placeholder="Short 1-2 sentence description" rows={2} aria-invalid={!!addErrors.description} />
              {addErrors.description && <span className="text-xs text-red-500">{addErrors.description}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageKitUrl">Video URL (ImageKit)</Label>
                <Input id="imageKitUrl" name="imageKitUrl" required placeholder="https://ik.imagekit.io/..." aria-invalid={!!addErrors.imageKitUrl} />
                {addErrors.imageKitUrl && <span className="text-xs text-red-500">{addErrors.imageKitUrl}</span>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
                <Input id="thumbnailUrl" name="thumbnailUrl" placeholder="https://..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" name="tags" placeholder="commercial, vibrant, fast" />
              </div>
              <div className="flex items-center space-x-2 h-10">
                <Checkbox id="featured" name="featured" />
                <Label htmlFor="featured" className="cursor-pointer">Featured (Show on category card?)</Label>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary"
              size="md"
              disabled={isPending}
            >
              {isPending ? "Adding..." : "Add Video"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Video List Table */}
      <Card className="rounded-[20px] shadow-sm border-[var(--border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[var(--bg-base)]">
              <TableRow>
                <TableHead className="w-[80px]">Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[120px]">Ratio</TableHead>
                <TableHead className="w-[100px]">Featured</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-[var(--text-secondary)]">
                    No videos found in this category.
                  </TableCell>
                </TableRow>
              ) : (
                videos.map((video) => (
                  <React.Fragment key={video.id}>
                    <TableRow>
                      <TableCell>
                        <div className="w-[60px] h-[40px] bg-[var(--text-primary)] rounded overflow-hidden relative">
                          {video.thumbnailUrl ? (
                            <Image src={video.thumbnailUrl} alt={video.title} fill sizes="60px" className="object-cover" />
                          ) : (
                            <video src={video.imageKitUrl} className="w-full h-full object-cover opacity-50" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-[var(--text-primary)]">{video.title}</div>
                        <div className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-1">{video.description}</div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 bg-[var(--bg-base)] rounded-full border border-[var(--border-subtle)]">
                          {video.aspectRatio}
                        </span>
                      </TableCell>
                      <TableCell>
                        {video.featured ? (
                          <span className="text-xs text-[var(--accent-terra)] font-semibold">Yes</span>
                        ) : (
                          <span className="text-xs text-[var(--text-secondary)]">No</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setEditingId(editingId === video.id ? null : video.id)}
                            aria-label={`Edit ${video.title}`}
                            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-terra)] focus-visible:outline-offset-2"
                          >
                            <Edit2 className="w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-terra)] focus-visible:outline-offset-2" aria-label={`Delete ${video.title}`}>
                                <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete video?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete &apos;{video.title}&apos; from the portfolio.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(video.id)}
                                  className="bg-red-500 hover:bg-red-600 text-[var(--bg-base)]"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Inline Edit Form */}
                    {editingId === video.id && (
                      <TableRow className="bg-[var(--bg-base)]/50">
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-6 border-b border-[var(--border-subtle)]">
                            <h3 className="font-semibold text-sm mb-4">Edit Video</h3>
                            <form onSubmit={(e) => handleEditSubmit(e, video.id)} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`title-${video.id}`}>Title</Label>
                                  <Input id={`title-${video.id}`} name="title" defaultValue={video.title} required aria-invalid={!!editErrors.title} />
                                  {editErrors.title && <span className="text-xs text-red-500">{editErrors.title}</span>}
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`aspectRatio-${video.id}`}>Aspect Ratio</Label>
                                  <Select name="aspectRatio" defaultValue={video.aspectRatio}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="vertical">Vertical (9:16)</SelectItem>
                                      <SelectItem value="horizontal">Horizontal (16:9)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`description-${video.id}`}>Description</Label>
                                <Textarea id={`description-${video.id}`} name="description" defaultValue={video.description} required rows={2} aria-invalid={!!editErrors.description} />
                                {editErrors.description && <span className="text-xs text-red-500">{editErrors.description}</span>}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`imageKitUrl-${video.id}`}>Video URL</Label>
                                  <Input id={`imageKitUrl-${video.id}`} name="imageKitUrl" defaultValue={video.imageKitUrl} required aria-invalid={!!editErrors.imageKitUrl} />
                                  {editErrors.imageKitUrl && <span className="text-xs text-red-500">{editErrors.imageKitUrl}</span>}
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`thumbnailUrl-${video.id}`}>Thumbnail URL</Label>
                                  <Input id={`thumbnailUrl-${video.id}`} name="thumbnailUrl" defaultValue={video.thumbnailUrl} />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                <div className="space-y-2">
                                  <Label htmlFor={`tags-${video.id}`}>Tags</Label>
                                  <Input id={`tags-${video.id}`} name="tags" defaultValue={video.tags?.join(', ')} />
                                </div>
                                <div className="flex items-center space-x-2 h-10">
                                  <Checkbox id={`featured-${video.id}`} name="featured" defaultChecked={video.featured} />
                                  <Label htmlFor={`featured-${video.id}`} className="cursor-pointer">Featured</Label>
                                </div>
                              </div>

                              <div className="flex justify-end gap-3 pt-2">
                                <Button 
                                  type="button" 
                                  variant="secondary" 
                                  size="md"
                                  onClick={() => setEditingId(null)}
                                  disabled={isPending}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  type="submit" 
                                  variant="primary"
                                  size="md"
                                  disabled={isPending}
                                >
                                  {isPending ? "Saving..." : "Save Changes"}
                                </Button>
                              </div>
                            </form>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
