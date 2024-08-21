'use client'

import React from 'react'
import { useToast } from '../ui/use-toast'
import { CldUploadWidget, CldImage } from 'next-cloudinary'
import Image from 'next/image';
import { dataUrl, getImageSize } from '@/lib/utils';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

type MediaUploaderProps = {
    onValueChange: (value: string) => void;
    setImage: React.Dispatch<any>;
    publicId: string;
    image: string;
    type: string;
}

const MediaUploader = ({
    onValueChange,
    setImage,
    image,
    publicId,
    type,
}: MediaUploaderProps) => {
  const { toast } = useToast()

  const onUploadSuccessHandler = (result: any) => {
    // 里面在做什么？ 
    // 1. 把图片的publicId, width, height, secureUrl 都存到image这个state里面
    // 2. 调用onValueChange这个函数，把图片的publicId传给onValueChange
    // 3. 调用toast这个函数，显示一个toast
    setImage((prevState: any) => ({
        ...prevState,
        publicId: result?.info?.public_id,
        width: result?.info?.width,
        height: result?.info?.height,
        secureURL: result?.info?.secure_url,
    }))

    onValueChange(result?.info?.public_id)

    toast({
        title: "Image uploaded successfully",
        description: "1 credit was deducted from your account",
        duration:5000,
        className: 'success-toast',
    })
  }

  const onUploadErrorHandler = () => {
    toast({
        title: "Something went wrong while uploading",
        description: "Please try again",
        duration:5000,
        className: 'error-toast',
    })
  }

  return (
    // TODO: Add a loading state 上传图片组件（可以上传拍照使用示例图片等功能）
    <CldUploadWidget
      uploadPreset='div_imaginify'
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
        {({ open }) => (
            <div className='flex flex-col gap-4'>
                <h3 className='h3-bold text-dark-600'>
                    Original
                </h3>

                {publicId ? (
                    // 有图片的时候 显示这个
                    <>
                      <div className='cursor-pointer overflow-hidden rounded-[10px]'>
                        <CldImage 
                          width={getImageSize(type, image, "width")}
                          height={getImageSize(type, image, "height")}
                          src={publicId}
                          alt="image"
                          sizes="(min-width: 767px) 100vw, 50vw"
                          placeholder={dataUrl as PlaceholderValue}
                          className="media-uploader_cldImage"
                        />
                      </div>
                    </>
                ): (
                    // 还没有图片的时候 显示这个
                    <div className='media-uploader_cta' onClick={() => open()}>
                        <div className='media-uploader_cta-image'>
                            <Image 
                              src='/assets/icons/add.svg'
                              alt='Add Image'
                              width={24}
                              height={24}
                            />
                        </div>
                        <p className='p-14-medium'>
                                Click here to upload image
                        </p>
                    </div>
                )}
            </div>
        )}
    </CldUploadWidget>
  )
}

export default MediaUploader
