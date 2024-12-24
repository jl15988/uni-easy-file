import FileTypes from "./FileTypes";

/**
 * 文件工具
 */
class EasyFile {

    types = FileTypes;

    setTypes(types: any) {
        // @ts-ignore
        this.types = types;
    }

    /**
     * 获取文件名（包括扩展名）
     *
     * ```
     * http://www.example.com/a/b/c.jpg => c.jpg
     * ```
     * @param {string} url 文件地址
     * @return {string}
     */
    fileName(url: string): string {
        if (!url) return '';
        return url.split('/').pop()!;
    }

    /**
     * 获取文件扩展名
     *
     * ```
     * http://www.example/com/a/b/c.jpg => jpg
     * ```
     * @param {string} url 文件地址
     * @return {string}
     */
    extName(url: string): string {
        if (!url) return '';
        return this.fileName(url).split('.').pop()!;
    }

    /**
     * 获取文件主名（不包括扩展名）
     *
     * ```
     * http://www.example.com/a/b/c.jpg => c
     * ```
     * @param {string} url 文件地址
     * @return {string}
     */
    mainName(url: string): string {
        if (!url) return '';
        return this.fileName(url).split('.').shift()!;
    }

    /**
     * 获取文件路径
     *
     * ```
     * http://www.example.com/a/b/c.jpg => http://www.example.com/a/b
     * ```
     * @param {string} url 文件地址
     * @return {string}
     */
    pathName(url: string): string {
        if (!url) return '';
        return url.split('/').slice(0, -1).join('/');
    }

    /**
     * 判断是否是指定类型
     * @param {string} url 文件地址
     * @param {string[]} types 类型数组
     * @return {boolean}
     */
    isType(url: string, types: string[]): boolean {
        const extName = this.extName(url).toLowerCase();
        return types.includes(extName);
    }

    /**
     * 判断是否是图片
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isImage(url: string): boolean {
        return this.isType(url, this.types.imageTypes);
    }

    /**
     * 判断是否是文档
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isDocument(url: string): boolean {
        return this.isType(url, this.types.documentTypes);
    }

    /**
     * 判断是否是视频
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isVideo(url: string): boolean {
        return this.isType(url, this.types.videoTypes);
    }

    /**
     * 判断是否是音频
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isAudio(url: string): boolean {
        return this.isType(url, this.types.audioTypes);
    }

    /**
     * 判断是否是压缩文件
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isCompress(url: string): boolean {
        return this.isType(url, this.types.compressTypes);
    }

    /**
     * 判断是否是代码文件
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isCode(url: string): boolean {
        return this.isType(url, this.types.codeTypes);
    }

    /**
     * 判断是否是Excel文件
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isExcel(url: string): boolean {
        return this.isType(url, this.types.excelTypes);
    }

    /**
     * 判断是否是Word文件
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isWord(url: string): boolean {
        return this.isType(url, this.types.wordTypes);
    }

    /**
     * 判断是否是PPT文件
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isPpt(url: string): boolean {
        return this.isType(url, this.types.pptTypes);
    }

    /**
     * 判断是否是PDF文件
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isPdf(url: string): boolean {
        return this.isType(url, this.types.pdfTypes);
    }

    /**
     * 判断是否是文本文件
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isText(url: string): boolean {
        return this.isType(url, this.types.textTypes);
    }

    /**
     * 判断是否是Markdown文件
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isMarkdown(url: string): boolean {
        return this.isType(url, this.types.markdownTypes);
    }

    /**
     * 判断是否是Office文件
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isOffice(url: string): boolean {
        return this.isWord(url) || this.isExcel(url) || this.isPpt(url);
    }

    /**
     * 判断是否是Office或PDF文件
     * @param {string} url 文件地址
     * @return {boolean}
     */
    isOfficeOrPdf(url: string): boolean {
        return this.isOffice(url) || this.isPdf(url);
    }

    /**
     * 获取文件临时地址
     * @param {string} url 文件地址
     * @return {Promise<string>}
     */
    getFileTempPath(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!url) {
                reject('文件地址为空');
                return;
            }
            uni.downloadFile({
                url,
                success: (res) => {
                    resolve(res.tempFilePath);
                },
                fail: (e) => {
                    reject(e);
                },
            });
        });
    }

    /**
     * 打开文件
     *
     * 根据文件类型调用不同的api打开文件
     * - 图片类文件调用预览图片（uni.previewImage）
     * - office及pdf类型文件调用打开文档（uni.openDocument）
     * - 其他类型不支持
     * @param {string} url 文件地址
     * @return {Promise<unknown>}
     */
    async openFile(url: string): Promise<unknown> {
        return new Promise(async (resolve, reject) => {
            if (!url) {
                reject('文件地址为空');
                return;
            }
            let tempPath = '';
            try {
                tempPath = await this.getFileTempPath(url);
            } catch (e) {
                reject(e);
                return;
            }
            this.openFileByTempPath(tempPath).then(res => {
                resolve(res);
            }).catch(e => {
                reject(e);
            })
        });
    }

    /**
     * 根据临时地址打开文件
     *
     * 根据文件类型调用不同的api打开文件
     * - 图片类文件调用预览图片（uni.previewImage）
     * - office及pdf类型文件调用打开文档（uni.openDocument）
     * - 其他类型不支持
     * @param {string} tempPath 文件临时地址
     * @return {Promise<unknown>}
     */
    async openFileByTempPath(tempPath: string): Promise<unknown> {
        return new Promise(async (resolve, reject) => {
            if (!tempPath) {
                reject('文件地址为空');
                return;
            }
            if (this.isImage(tempPath)) {
                // 调用微信api预览图片
                uni.previewImage({
                    // 开启时右上角会有三点，点击可以保存
                    showMenu: true,
                    urls: [tempPath],
                    current: tempPath,
                    success: (res) => {
                        resolve(res);
                    },
                    fail: (res) => {
                        reject(res);
                    }
                });
            } else if (this.isOfficeOrPdf(tempPath)) {
                uni.openDocument({
                    filePath: tempPath,
                    // 开启时右上角会有三点，点击可以保存
                    showMenu: true,
                    success: (res) => {
                        resolve(res);
                    },
                    fail: (res) => {
                        reject(res);
                    }
                });
            }
        });
    }

    /**
     * 获取文件 MD5
     *
     * 仅获取文件 MD5 时建议使用此方法，如果同时获取文件大小，建议直接使用 `getFileInfo` 方法
     *
     * | App | H5 | 微信小程序 |
     * | --- | --- | --- |
     * | √ | √ | × |
     *
     * @param {string} url 文件地址
     * @return {Promise<string|undefined>}
     */
    md5(url: string): Promise<string | undefined> {
        return new Promise(async (resolve, reject) => {
            let tempPath = '';
            try {
                tempPath = await this.getFileTempPath(url);
            } catch (e) {
                reject(e);
                return;
            }
            uni.getFileInfo({
                filePath: tempPath,
                digestAlgorithm: 'md5',
                success: (res) => {
                    resolve(res.digest);
                },
                fail: (e) => {
                    reject(e);
                },
            });
        });
    }

    /**
     * 获取文件 SHA1
     *
     * 仅获取文件 SHA1 时建议使用此方法，如果同时获取文件大小，建议直接使用 `getFileInfo` 方法
     *
     * | App | H5 | 微信小程序 |
     * | --- | --- | --- |
     * | √ | √ | × |
     *
     * @param {string} url 文件地址
     * @return {Promise<string|undefined>}
     */
    sha1(url: string): Promise<string | undefined> {
        return new Promise(async (resolve, reject) => {
            let tempPath = '';
            try {
                tempPath = await this.getFileTempPath(url);
            } catch (e) {
                reject(e);
                return;
            }
            uni.getFileInfo({
                filePath: tempPath,
                digestAlgorithm: 'sha1',
                success: (res) => {
                    resolve(res.digest);
                },
                fail: (e) => {
                    reject(e);
                },
            });
        });
    }

    /**
     * 获取文件大小，以字节为单位
     *
     * 仅获取文件大小时建议使用此方法，如果同时获取文件摘要，建议直接使用 `getFileInfo` 方法
     *
     * | App | H5 | 微信小程序 |
     * | --- | --- | --- |
     * | √ | √ | × |
     *
     * @param {string} url 文件地址
     * @return {Promise<number>}
     */
    size(url: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            let tempPath = '';
            try {
                tempPath = await this.getFileTempPath(url);
            } catch (e) {
                reject(e);
                return;
            }
            uni.getFileInfo({
                filePath: tempPath,
                success: (res) => {
                    resolve(res.size);
                },
                fail: (e) => {
                    reject(e);
                },
            });
        });
    }

    /**
     * 获取文件信息
     *
     * | App | H5 | 微信小程序 |
     * | --- | --- | --- |
     * | √ | √ | × |
     *
     * @param {string} url 文件地址
     * @param {'md5'|'sha1'} digestAlgorithm 摘要算法，支持 md5、sha1
     * @return {Promise<UniApp.GetFileInfoSuccess>}
     */
    getFileInfo(url: string, digestAlgorithm: 'md5' | 'sha1' = 'md5'): Promise<UniApp.GetFileInfoSuccess> {
        return new Promise(async (resolve, reject) => {
            let tempPath = '';
            try {
                tempPath = await this.getFileTempPath(url);
            } catch (e) {
                reject(e);
                return;
            }
            uni.getFileInfo({
                filePath: tempPath,
                digestAlgorithm: digestAlgorithm,
                success: (res) => {
                    resolve(res);
                },
                fail: (e) => {
                    reject(e);
                },
            });
        });
    }
}

export default new EasyFile();
