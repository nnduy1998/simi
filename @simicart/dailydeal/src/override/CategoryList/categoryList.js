import React from 'react';
import { useIntl } from 'react-intl';
import { string, number, shape } from 'prop-types';
import { useCategoryList } from '@magento/peregrine/lib/talons/CategoryList/useCategoryList';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import defaultClasses from '@magento/venia-ui/lib/components/CategoryList/categoryList.css';
import CategoryTile from '@magento/venia-ui/lib/components/CategoryList/categoryTile';
import { useProductList } from '../../talons/useProductList';
import { useProductDetails } from '../../talons/useProductDetail';
import Gallery from '@magento/venia-ui/lib/components/Gallery';


// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapCategory = categoryItem => {
    const { items } = categoryItem.productImagePreview;
    return {
        ...categoryItem,
        productImagePreview: {
            items: items.map(item => {
                const { small_image } = item;
                return {
                    ...item,
                    small_image:
                        typeof small_image === 'object'
                            ? small_image.url
                            : small_image
                };
            })
        }
    };
};

const CategoryList = props => {

    const {productListData,
        productListLoading,
        derivedErrorMessage} = useProductList();
    console.log("productListData",productListData)
    const skuDatas = [];
    productListData.MpDailyDeals.items.map(product=>{
        return skuDatas.push(product.product_sku);
    })
    
    console.log("skuDatas", skuDatas);
    
    const {detailsData,
        detailsLoading,
        deriveErrorMessage} = useProductDetails({sku_product:skuDatas});
    console.log("detailsData",detailsData)


    const { id, title } = props;
    const talonProps = useCategoryList({ 
        id 
    });

    const { childCategories, error, loading } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const header = title ? (
        <div className={classes.header}>
            <h2 className={classes.title}>
                <span>{title}</span>
            </h2>
        </div>
    ) : null;

    let child;

    if (!childCategories) {
        if (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }

            return <ErrorView />;
        } else if (loading) {
            child = fullPageLoadingIndicator;
        }
    } else {
        if (childCategories.length) {
            child = (
                <div className={classes.content}>
                    {childCategories.map(item => (
                        <CategoryTile
                            item={mapCategory(item)}
                            key={item.url_key}
                        />
                    ))}
                </div>
            );
        } else {
            return (
                <ErrorView
                    message={formatMessage({
                        id: 'categoryList.noResults',
                        defaultMessage: 'No child categories found.'
                    })}
                />
            );
        }
    }

    return (
        <div className={classes.root}>
            {header}
            {child}

            {detailsData ? (
                <Gallery items={detailsData.products.items}/>
            ):(null)}
        </div>
    );
};

CategoryList.propTypes = {
    id: number.isRequired,
    title: string,
    classes: shape({
        root: string,
        header: string,
        title: string,
        content: string
    })
};

export default CategoryList;
