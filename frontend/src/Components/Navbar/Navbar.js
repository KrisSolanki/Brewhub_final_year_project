import React, { useState, useEffect } from 'react'; 
import './Navbar.css' ;
import Logo from '../../Assets/NavbarImgs/test1.png' ;
import Search from '../../Assets/NavbarImgs/search.png';

// import { IoHomeOutline } from "react-icons/io5";<IoHomeOutline />
import { IoIosHome } from "react-icons/io";
import { MdGroups } from "react-icons/md";
// import { MdLogin } from "react-icons/md";<MdLogin />
import { RiLoginBoxFill } from "react-icons/ri";
// import { CiShoppingCart } from "react-icons/ci";<CiShoppingCart />
import { FaShoppingCart } from "react-icons/fa";

import { FaCircleUser } from "react-icons/fa6";



const Navbar = () => {
    
    const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    document.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
    //   document.addEventListener('scroll', handleScroll);
  return (
    <>
    {/* <div className='container'> */}
    <div className={`container ${isScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
            <div className="logostl">
            <img src={Logo} alt="Logoimg" className="logo-img" />
            </div>
            <p>BREWHUB</p>
        </div>
        <div className="lists">
            <ul>
                <li>
                    <div className="searchbox">
                    <input type="text" placeholder="Search" className='searchtxt'/>
                    <button className="btn1" id="btn1" type="submit"><img src={Search} alt="search img" className='search-img'/></button>
        </div>
                </li>
                <li><a className='active' href='https://www.google.com/'><span><IoIosHome /></span>Home</a></li>
                <li><a className='' href='www.youtube.com'><span><MdGroups /></span>About us</a></li>
                <li><a className='' href='www.yahoo,com'><span><RiLoginBoxFill /></span>Sign in</a></li>
                <li><a className='' href='www.facebook.com'><span><FaShoppingCart /></span>Cart</a></li>
                <li><a className='' href='www.instagram.com'><span><FaCircleUser /></span>Profile</a></li>
            </ul>
        </div>
        
      
    </div>
    <body>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis earum quisquam id dolor soluta perspiciatis alias dignissimos consequatur 
        voluptatum possimus maiores rem, quas natus voluptatibus quidem? Quod officiis ut porro?
        lorem1000 Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad quod mollitia facilis tempore? Molestias aliquid harum earum ea. Earum numquam similique molestias autem quidem dolorum quasi corrupti non error nulla eum explicabo magni quae maiores et perspiciatis, deleniti perferendis quam illo magnam dolore exercitationem rem. Porro vel corrupti tempora omnis adipisci blanditiis culpa asperiores debitis temporibus laudantium! Delectus sit minus incidunt, soluta id repudiandae! Amet magni placeat ex voluptatibus dolor porro iste inventore quae a quam. Nulla iste temporibus ratione. Neque dolor consequatur praesentium laboriosam vero nobis eum animi quam! Dignissimos officiis quae ipsa a architecto quidem aliquam, sapiente culpa. Quidem magnam rem ab dolorum magni repellat ad, necessitatibus quas pariatur, aut odit saepe delectus enim suscipit placeat id eaque quos molestiae. Reiciendis voluptates, tempora suscipit adipisci exercitationem sapiente officiis fuga unde, fugiat impedit quos neque debitis deleniti in. Quo aliquam sit quae dolor enim voluptate recusandae vel commodi eius nesciunt delectus, earum laboriosam, debitis quibusdam, repudiandae voluptates? Id voluptas vitae, provident aspernatur modi eligendi, expedita dignissimos voluptates omnis et numquam fugiat sequi molestias, quos neque in aliquam? Laboriosam saepe non nisi ullam, nam veniam inventore, corporis laudantium a exercitationem magnam optio dolorum veritatis incidunt necessitatibus est nihil cum maxime maiores aut cupiditate amet voluptatem? Sit libero praesentium, adipisci voluptatibus quisquam labore officia, quae in eos quidem cumque laboriosam, veritatis ducimus cum at ipsum corrupti magni sapiente doloremque. Enim magni non aspernatur ad porro tenetur, in dolorum aperiam accusamus nihil dolore tempora suscipit tempore odit iste recusandae sunt aut. Ipsum consectetur animi aspernatur odit! Commodi asperiores impedit quasi vero, et assumenda? Cupiditate impedit eveniet in recusandae enim unde nemo eius autem sint eos soluta dignissimos ipsa, quis quidem cum minus repudiandae esse beatae! Veritatis necessitatibus, laudantium excepturi nostrum, cum consectetur earum facilis et temporibus cumque dolorem obcaecati aperiam aspernatur nesciunt voluptatem adipisci! Molestiae dignissimos quaerat quo recusandae nulla id qui magnam quos, dolor ad voluptatem vitae odio rerum voluptates corporis, debitis culpa numquam. Eos dolor consequatur cum recusandae commodi hic? Dolore quam voluptates dolor, odit facilis quis iusto velit autem minima, reprehenderit molestias asperiores officiis perspiciatis sed inventore quia dolores id numquam perferendis voluptatum itaque eligendi ipsa? Adipisci dolor, dolorum recusandae cumque ut et officia animi quaerat vero ipsum, cum voluptates maxime id nihil, aspernatur alias unde eius quidem neque pariatur quisquam illum. Fugiat possimus fuga unde, optio eligendi eveniet odio dolor modi ullam, officiis quo, sed a iure distinctio iste quaerat sint ipsa in ad ea dolorum vel illo rerum. Quasi facere repellendus veniam ex labore suscipit facilis omnis itaque voluptate id magni cum minima, repellat porro culpa fugit cumque esse laborum. Iure impedit voluptatum necessitatibus reprehenderit neque eligendi asperiores rerum, error enim tenetur ut at autem optio, laborum, recusandae perferendis animi deleniti repudiandae consequatur officiis. Quia temporibus earum ea distinctio quis! Cumque laboriosam inventore hic! Voluptas odio quia reprehenderit, ipsa delectus consequatur qui quibusdam sint neque velit possimus eveniet exercitationem libero iure eum? Modi voluptas voluptatibus quae similique tenetur iusto repellat, cupiditate obcaecati distinctio ad. Dolore, accusamus soluta.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus necessitatibus dolor fuga dolores alias modi! Vel a nesciunt, quia iure nostrum perspiciatis eius corporis aliquam fugit sunt voluptate quo provident. Sit, nisi. Ut ducimus labore eum omnis dolores voluptatum fuga corporis rem! Aspernatur earum ab impedit nulla consequatur voluptatum molestiae! Libero debitis ipsam molestiae voluptatum itaque tenetur? Sint eos sit quia ut fuga, facilis perspiciatis voluptas neque molestiae consequatur, ea autem quisquam ipsum ducimus saepe cumque! Quasi placeat aperiam omnis delectus in suscipit sunt rem eius quo laudantium. Porro quas cupiditate assumenda vel at natus odio iusto, excepturi aliquam debitis totam accusamus fuga eaque veniam adipisci vero tempora doloremque saepe ad voluptatem asperiores dolor aut! Eligendi, blanditiis. Harum ut molestiae, quas non sed eos aut natus saepe doloribus expedita perspiciatis fuga autem voluptate voluptatem iste, ipsum quae veniam. Enim quos eos praesentium hic asperiores deserunt! Possimus distinctio culpa eum vel iste numquam odio perferendis accusamus natus voluptate libero officia inventore suscipit accusantium eveniet modi nulla rerum earum sequi, voluptates adipisci aperiam maiores ipsum? Voluptatum veritatis architecto, aliquid sed porro deserunt eligendi unde rerum esse expedita quo officiis id nemo dolore corrupti vel suscipit nisi dolor. Tempore saepe accusantium provident, molestias facere, porro aut quibusdam, minus quia laudantium quas? Iusto eos tempora esse minima amet, quis totam illum quod laudantium obcaecati similique nemo asperiores doloribus, numquam magni minus non sit ducimus voluptatum voluptatem, nihil suscipit nam? Voluptates quae, sed voluptatibus praesentium qui perspiciatis blanditiis. Necessitatibus, blanditiis molestias voluptas tenetur, facere magnam quos nesciunt aliquam neque repellat quod accusantium fuga odit optio. Quasi vero impedit ea est repellendus vel alias sapiente tenetur voluptatum laboriosam a quae repudiandae sint, eos natus nihil perferendis enim cum delectus sequi optio voluptate autem placeat? Molestias, dicta eaque impedit facilis incidunt iste at iusto tempora explicabo ullam aut natus vel ratione voluptate veritatis eum officia doloremque omnis corporis accusantium maxime quisquam soluta! Quos sit libero repellat tenetur quis quia itaque vero natus, esse ab animi quaerat praesentium, ullam iste reiciendis, nostrum autem dignissimos inventore distinctio voluptate incidunt voluptatem molestias deleniti. Impedit praesentium est saepe accusamus repellendus doloribus quibusdam facere laborum exercitationem quia adipisci delectus iure eos eligendi commodi, porro perferendis, eveniet aut alias nemo! Ad nostrum labore dolorem tempore tempora at, cupiditate esse similique quaerat iste, in nesciunt harum vitae voluptas laboriosam illo mollitia reprehenderit commodi velit officiis asperiores. Voluptates dolore amet minima quam recusandae quas. Ipsum ut recusandae aliquam maiores facilis repellendus, cum placeat nihil quis iure laborum aperiam reprehenderit quos corporis debitis fugiat blanditiis quas, laboriosam, culpa consequatur officiis maxime quam commodi. Ea architecto eum exercitationem recusandae facilis odit fugiat possimus maxime culpa, ab tempore quaerat debitis dolore fugit temporibus a officiis nostrum nihil dolor doloribus vel! Illum culpa modi itaque, velit, laboriosam voluptas dolorem consectetur repudiandae minus ipsum molestias rerum aliquam quia repellat debitis sed dolorum blanditiis. Ipsum, libero. Vero, dolorem ullam fugit deleniti consectetur magnam ex rem sequi nostrum saepe eveniet corporis aliquid animi sunt quia temporibus odio rerum voluptatibus suscipit recusandae sit quod totam. Magni et nostrum libero odio, veritatis perspiciatis dolor sit laboriosam non illum unde modi hic quaerat esse repellendus minus amet atque provident tempora ut. Pariatur adipisci deserunt ipsum voluptatem ipsa magni nisi, eius exercitationem, reprehenderit suscipit similique. Est autem quo, sit doloremque porro consectetur! Repellendus neque eos doloribus accusamus ipsam unde! Enim animi, ratione fuga magni delectus voluptatem, velit perspiciatis ea minus rem iste quam maxime temporibus hic exercitationem quaerat. Voluptatibus sed rem ut assumenda cumque quo ipsa veritatis doloremque aliquid. Hic, quos. Debitis aut ducimus fugiat ut iusto unde, est quisquam expedita sed rerum, mollitia, nam qui assumenda praesentium aliquam amet harum inventore maiores dolore quod facilis nobis at! Maiores voluptatum maxime facere aspernatur magnam beatae quibusdam officiis non laboriosam! Asperiores nam iure autem vel quaerat nostrum corporis quis sequi molestiae, fuga nesciunt. Ex neque deleniti voluptatem, doloremque obcaecati cupiditate, officia consectetur laboriosam voluptatibus, molestias laborum soluta ad omnis animi! Neque ipsam consequatur eveniet cumque suscipit autem quia repellat perspiciatis. Labore nostrum expedita corporis itaque eum, aut praesentium fuga aspernatur fugiat impedit molestias ipsa? Mollitia illum accusantium ab molestias? Fugit, magnam doloremque iure neque ut quas, eum rem omnis corporis accusantium aliquam tempore maiores fugiat itaque tempora iste, amet vitae. Ipsa accusamus a eius vitae aliquid maiores suscipit voluptatibus dolor molestiae voluptas cupiditate, facere laboriosam unde quas ratione, debitis ab repellendus fuga excepturi, porro at ad quasi? Eveniet voluptas blanditiis, tempora quidem officia iste, error quam quibusdam aliquam voluptatum ut assumenda dolores vero iure odit ratione itaque provident soluta incidunt? Delectus sed voluptate ab deleniti dolore aut explicabo ex veritatis at iure. Ex veniam minus architecto dolor repellendus, porro minima dignissimos doloribus nesciunt, ea molestias eveniet tempora modi ullam explicabo aperiam similique perspiciatis consequatur voluptatum quidem? Itaque quae aspernatur velit deserunt vero doloremque asperiores accusantium iusto blanditiis aliquid perspiciatis fugiat, repellat eligendi molestias, quo incidunt nostrum possimus vitae. Minima illo cupiditate laboriosam molestiae libero sit, beatae non repellendus aspernatur? Nostrum voluptatem tempora quas necessitatibus dolores placeat et maiores fuga. Illum quis, ipsum tempore praesentium quos nam error doloremque cupiditate non incidunt laborum. Eveniet id in, nisi sint corrupti natus distinctio facere rerum cumque labore sit ipsam temporibus nobis tempore dolore, inventore modi veritatis necessitatibus suscipit? Pariatur voluptatem, harum fuga unde quasi quae eveniet consequatur quos delectus sed officia animi incidunt? Vel consequatur repellendus architecto quaerat vero placeat dolores, ab quisquam recusandae impedit tenetur pariatur totam ducimus ipsam consequuntur similique neque maxime quia dolore repudiandae dignissimos quas quos? Officiis veritatis quos, totam, ipsam porro in facilis minus reprehenderit, voluptatibus inventore unde et illum nam? Aliquid nemo doloribus, rem voluptatibus dolores tempore provident nobis quaerat quod beatae consequuntur, dolor commodi quo optio, sint corrupti ea quos. Quas, quo excepturi. Dolore omnis sed dignissimos? Eveniet, aperiam. Aspernatur qui aliquid harum totam! Dolore ducimus vitae reiciendis assumenda ad totam! Dolorum facilis iusto voluptatibus perferendis illum. Iusto accusantium sunt nesciunt. Facilis nihil hic ipsa sit deserunt, quae iusto ipsam atque quasi quo sapiente dolor quia, accusamus recusandae possimus architecto veniam dolorem nam?
    </body>
    </>
  )
}
export default Navbar
